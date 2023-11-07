import { getActiveTab, urlIsAlreadyOpened } from '../lib/tabs.js'
import { getBookmarkById, removeOrArchiveBookmark, updateCapsuleData, isRegroupable } from '../lib/bookmarks.js'
import { getSettingValue, getSettingValues } from '../lib/settings_store.js'
import { forceArray, isCapsulableUrl } from '../lib/utils.js'
import { createLogRecord } from '../lib/logs.js'
import { getNextNonBlockedTime } from '../settings/week_time_picker_helpers.js'

export async function openBookmark (bookmark) {
  return processBookmark({ bookmark, open: true })
}

async function processBookmarkWithoutOpening (bookmark) {
  return processBookmark({ bookmark, open: false })
}

async function processBookmark ({ bookmark, open }) {
  const {
    'settings:enableBlockedWeekTimes': enableBlockedWeekTimes,
    'settings:blockedWeekTimes': blockedWeekTimes,
  } = await getSettingValues([
    'settings:enableBlockedWeekTimes',
    'settings:blockedWeekTimes',
  ])

  if (enableBlockedWeekTimes) {
    const nextNonBlockedTime = getNextNonBlockedTime(blockedWeekTimes)
    // Blocked until the end of the day, so nothing to schedule today
    if (!nextNonBlockedTime) return
  }

  const bookmarkData = await getBookmarkById(bookmark.id)
  if (!bookmarkData) {
    console.error('bookmark data not found', bookmark)
    return
  }
  Object.assign(bookmarkData, bookmark)
  if (Number.isInteger(bookmarkData.repeat)) {
    bookmarkData.repeat -= 1
  }
  if (open) await openBookmarkIfNeeded(bookmark)
  if (Number.isInteger(bookmarkData.repeat) && bookmarkData.repeat < 0) {
    return removeOrArchiveBookmark(bookmark)
  } else {
    await updateCapsuleData({ bookmarkData })
  }
}

async function openBookmarkIfNeeded (bookmark) {
  const { url } = bookmark
  const [
    allowDuplicatedTabs,
    bookmarkUrlIsAlreadyOpened,
  ] = await Promise.all([
    getSettingValue('settings:allowDuplicatedTabs'),
    urlIsAlreadyOpened(url),
  ])
  if (!bookmarkUrlIsAlreadyOpened || allowDuplicatedTabs) {
    const tab = await browser.tabs.create({ url, active: false })
    setTimeout(checkTabState({ tab, bookmark }), 500)
    await createLogRecord({ event: 'opened-bookmark', bookmark })
  } else {
    await createLogRecord({ event: 'skipped-already-opened-bookmark', bookmark })
  }
}

const checkTabState = ({ tab, bookmark, attempt = 0 }) => async () => {
  if (attempt > 10) return
  const currentTabData = await browser.tabs.get(tab.id)
  // Check that the URL isn't browser intermediary URL (such as about: or chrome:)
  if (isCapsulableUrl(currentTabData.url) && currentTabData.url !== bookmark.url) {
    possiblyOutdatedBookmarkData[currentTabData.id] = {
      bookmarkId: bookmark.id,
      possibleUpdate: { url: currentTabData.url, title: currentTabData.title },
    }
    await browser.storage.local.set({ possiblyOutdatedBookmarkData })
    getActiveTab()
  } else {
    setTimeout(checkTabState({ tab, bookmark, attempt: ++attempt }), 500)
  }
}

export const possiblyOutdatedBookmarkData = {}

browser.runtime.onMessage.addListener(({ event, tabId }) => {
  if (event === 'popup-updated-capsule' || event === 'popup-deleted-capsule') {
    delete possiblyOutdatedBookmarkData[tabId]
  }
})

let overflowTab, overflowTabPromise

const overflowTabTitle = 'Time Capsule - Overflow'
const overflowTabPathname = '/overflow/overflow.html'
const overflowTabUrl = `${location.origin}${overflowTabPathname}`

export async function openOverflowMenu (bookmarks) {
  bookmarks = forceArray(bookmarks)
  await Promise.all(bookmarks.map(processBookmarkWithoutOpening))
  const ids = bookmarks.map(bookmark => bookmark.id)
  // This will fail now that we use background script "persistent": false
  if (!overflowTab) {
    if (overflowTabPromise) {
      overflowTab = await overflowTabPromise
    } else {
      overflowTab = await findOverflowTab()
    }
  }
  if (overflowTab?.id) {
    // The tab object returned by browser.tabs.create might have the wrong url
    // Ex: "about:blank" in Firefox, thus the need to refresh its data
    overflowTabPromise = browser.tabs.get(overflowTab.id)
    overflowTab = await overflowTabPromise
  }
  if (overflowTab?.url.startsWith(overflowTabUrl)) {
    await updateOverflowMenu(ids)
  } else {
    await createOverflowMenu(ids)
  }
  await createLogRecord({ event: 'opened-overflow-menu', bookmarks })
}

async function findOverflowTab () {
  const tabs = await browser.tabs.query({ title: overflowTabTitle })
  const overflowTab = tabs.filter(({ url }) => url.startsWith(overflowTabUrl))[0]
  return overflowTab
}

async function createOverflowMenu (ids) {
  const url = `${overflowTabPathname}?ids=${ids.join('|')}`
  overflowTabPromise = browser.tabs.create({
    url,
    active: false
  })
  overflowTab = await overflowTabPromise
}

async function updateOverflowMenu (ids) {
  const querystring = overflowTab.url.split('?')[1]
  const previousIds = new URLSearchParams(querystring).get('ids')?.split('|') || []
  const newIds = ids.filter(id => !previousIds.includes(id))
  const url = `${overflowTabPathname}?ids=${previousIds.concat(newIds).join('|')}`
  await browser.tabs.update(overflowTab.id, {
    url,
    active: false
  })
}

let previousOverflowMenuPromise
export async function openSingleBookmarkOrOverflowMenu (bookmark) {
  const {
    'settings:maxCapsules': maxCapsules,
    'settings:keepExpiredCapsulesAsNormalBookmarks': keepExpiredCapsulesAsNormalBookmarks,
  } = await getSettingValues([
    'settings:maxCapsules',
    'settings:keepExpiredCapsulesAsNormalBookmarks',
  ])
  if (maxCapsules === 0 && isRegroupable({ bookmark, keepExpiredCapsulesAsNormalBookmarks })) {
    // Prevent opening several overflow menus at once
    await previousOverflowMenuPromise
    previousOverflowMenuPromise = await openOverflowMenu(bookmark)
  } else {
    await openBookmark(bookmark)
  }
}

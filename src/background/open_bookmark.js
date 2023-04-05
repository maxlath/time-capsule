import { getActiveTab, urlIsAlreadyOpened } from '../lib/tabs.js'
import { getById, removeOrArchiveBookmark, updateCapsuleData } from '../lib/bookmarks.js'
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

  const bookmarkData = await getById(bookmark.id)
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

export async function openOverflowMenu (bookmarks) {
  bookmarks = forceArray(bookmarks)
  // TODO: Add corresponding log record
  await Promise.all(bookmarks.map(processBookmarkWithoutOpening))
  const ids = bookmarks.map(bookmark => bookmark.id)
  const url = `/overflow/overflow.html?ids=${ids.join('|')}`
  await browser.tabs.create({
    url,
    active: false
  })
  await createLogRecord({ event: 'opened-overflow-menu', bookmarks })
}

export async function openSingleBookmarkOrOverflowMenu (bookmark) {
  const maxCapsules = await getSettingValue('settings:maxCapsules')
  if (maxCapsules === 0) {
    await openOverflowMenu(bookmark)
  } else {
    await openBookmark(bookmark)
  }
}

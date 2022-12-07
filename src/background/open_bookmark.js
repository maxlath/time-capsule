import { createTab, getActiveTab, getTabById, urlIsAlreadyOpened } from '../lib/tabs.js'
import { getById, removeById, updateCapsuleData } from '../lib/bookmarks.js'
import { getSettingValue } from '../lib/settings_store.js'
import { isCapsulableUrl } from '../lib/utils.js'
import { createLogRecord } from '../lib/logs.js'

export async function openBookmark (bookmark) {
  return processBookmark({ bookmark, open: true })
}

export async function processBookmarkWithoutOpening (bookmark) {
  return processBookmark({ bookmark, open: false })
}

async function processBookmark ({ bookmark, open }) {
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
  await updateCapsuleData({ bookmarkData })
  if (bookmarkData.repeat < 0) {
    // Keep the bookmark at hand for the logs
    return removeById(bookmark.id)
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
    const tab = await createTab({ url, active: false })
    setTimeout(checkTabState({ tab, bookmark }), 500)
    await logEvent('opened-bookmark', bookmark)
  } else {
    await logEvent('skipped-already-opened-bookmark', bookmark)
  }
}

async function logEvent (event, bookmark) {
  console.log(event, bookmark)
  await createLogRecord({
    event,
    timestamp: Date.now(),
    bookmarkId: bookmark.id,
    url: bookmark.url,
    title: bookmark.cleanedTitle,
    remainingRepeats: bookmark.repeat,
  })
}

const checkTabState = ({ tab, bookmark, attempt = 0 }) => async () => {
  if (attempt > 10) return
  const currentTabData = await getTabById(tab.id)
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

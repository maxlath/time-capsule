import { createTab, getActiveTab, getTabById, urlIsAlreadyOpened } from '../lib/tabs.js'
import { getById, archiveById, updateCapsuleData } from '../lib/bookmarks.js'
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
  if (open) await openBookmarkIfNeeded(bookmark)
  if (Number.isInteger(bookmarkData.repeat)) {
    bookmarkData.repeat -= 1
  }
  await updateCapsuleData({ bookmarkData })
  if (bookmarkData.repeat === 0) {
    return archiveById(bookmark.id)
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
    console.log('opening', bookmark)
    const tab = await createTab({ url, active: false })
    setTimeout(checkTabState({ tab, bookmark }), 500)
    await createLogRecord({ event: 'opened-bookmark', bookmarkId: bookmark.id, timestamp: Date.now() })
  } else {
    console.log('already opened: skipping', bookmark)
  }
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

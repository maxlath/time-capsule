import { getLastFocusedWindowId } from './windows.js'
import { getBookmarkById, getCapsuleOrArchivedBookmarkByUrl } from './bookmarks.js'
import { isCapsulableUrl } from './utils.js'

// Replacing the deprecated getSelected
// see https://developer.chrome.com/extensions/tabs#method-getSelected
export async function getActiveTab () {
  const [ activeTabs, focusedWindowId ] = await Promise.all([
    browser.tabs.query({ active: true }),
    getLastFocusedWindowId()
  ])
  return activeTabs.filter(tab => tab.windowId === focusedWindowId)[0]
}

export const getActiveTabId = () => getActiveTab().then(tab => tab.id)

export const getActiveTabUrl = () => getActiveTab().then(tab => tab.url)

export async function getTabByUrl (url) {
  const tabs = await browser.tabs.query({ url })
  return tabs[0]
}

export async function getActiveTabBookmarkData () {
  const { id: activeTabId, url: activeTabUrl, title: activeTabTitle } = await getActiveTab()
  const res = {
    activeTab: {
      id: activeTabId,
      url: activeTabUrl,
      title: activeTabTitle
    }
  }
  if (isCapsulableUrl(activeTabUrl)) {
    res.bookmark = await getCapsuleOrArchivedBookmarkByUrl(activeTabUrl)
  }
  if (res.bookmark) return res

  const { possiblyOutdatedBookmarkData = {} } = await browser.storage.local.get('possiblyOutdatedBookmarkData')

  const { bookmarkId, possibleUpdate } = possiblyOutdatedBookmarkData[activeTabId] || {}
  if (bookmarkId) {
    try {
      res.bookmark = await getBookmarkById(bookmarkId)
    } catch (err) {
      if (!err.message.includes('not found')) throw err
    }
    if (res.bookmark) res.possibleUpdate = possibleUpdate
  }
  return res
}

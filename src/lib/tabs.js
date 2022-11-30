import { getLastFocusedId } from './windows.js'
import { parse, getByUrl as getBookmarkByUrl } from './bookmarks.js'

export const createTab = browser.tabs.create.bind(browser.tabs)

// Replacing the deprecated getSelected
// see https://developer.chrome.com/extensions/tabs#method-getSelected
export function getActiveTab () {
  return Promise.all([
    browser.tabs.query({ active: true }),
    getLastFocusedId()
  ])
  .then(([ activeTabs, focusedWindowId ]) => {
    return activeTabs.filter(tab => tab.windowId === focusedWindowId)[0]
  })
}

export const getCurrentTabId = () => getActiveTab().then(tab => tab.id)

export const getUrl = () => getActiveTab().then(tab => tab.url)

export async function getCurrentUrlBookmarkData () {
  const bookmarkData = await getUrl().then(getBookmarkByUrl)
  if (bookmarkData) return parse(bookmarkData)
}

export async function getUrlBookmarkData (url) {
  const bookmarkData = await getBookmarkByUrl(url)
  if (bookmarkData) return parse(bookmarkData)
}

export function getCurrentUrlBookmarkId () {
  return getCurrentUrlBookmarkData()
  .then(bookmarkData => bookmarkData && bookmarkData.id)
}

import { getLastFocusedId } from './windows'
import { parse, getByUrl as getBookmarkByUrl } from './bookmarks'

export const create = browser.tabs.create.bind(browser.tabs)

// Replacing the deprecated getSelected
// see https://developer.chrome.com/extensions/tabs#method-getSelected
export function getActive () {
  return Promise.all([
    browser.tabs.query({ active: true }),
    getLastFocusedId()
  ])
  .then(([ activeTabs, focusedWindowId ]) => {
    return activeTabs.filter(tab => tab.windowId === focusedWindowId)[0]
  })
}

export const getCurrentTabId = () => getActive().then(tab => tab.id)

export const getUrl = () => getActive().then(tab => tab.url)

export async function getCurrentUrlBookmarkData () {
  const bookmarkData = await getUrl().then(getBookmarkByUrl)
  if (bookmarkData) return parse(bookmarkData)
}


export function getCurrentUrlBookmarkId () {
  return getCurrentUrlBookmarkData()
  .then(bookmarkData => bookmarkData && bookmarkData.id)
}

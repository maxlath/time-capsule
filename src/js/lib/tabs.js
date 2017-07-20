const promisify = require('./promisify_chrome')
const create = promisify(chrome.tabs.create, chrome.tabs)
const query = promisify(chrome.tabs.query, chrome.tabs)
const windows = require('./windows')
const bookmarks = require('./bookmarks')

const API = {
  create,
  // replacing the deprecated getSelected
  // see https://developer.chrome.com/extensions/tabs#method-getSelected
  getActive: () => {
    return Promise.all([
      query({ active: true }),
      windows.getLastFocusedId()
    ])
    .then(([activeTabs, focusedWindowId]) => {
      return activeTabs.filter(tab => tab.windowId === focusedWindowId)[0]
    })
  },
  getCurrentTabId: () => API.getActive().then(tab => tab.id),
  getUrl: () => API.getActive().then(tab => tab.url),
  getCurrentUrlBookmarkData: () => {
    return API.getUrl()
    .then(bookmarks.getByUrl)
  },
  getCurrentUrlBookmarkId: () => {
    return API.getCurrentUrlBookmarkData()
    .then(bookmarkData => bookmarkData && bookmarkData.id)
  }
}

module.exports = API

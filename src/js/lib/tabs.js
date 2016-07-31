const promisify = require('../lib/promisify_chrome')
const create = promisify(chrome.tabs.create, chrome.tabs)
const query = promisify(chrome.tabs.query, chrome.tabs)
const bookmarks = require('./bookmarks')
const _ = require('../lib/utils')

const API = {
  create: create,
  // replacing the deprecated getSelected
  // see https://developer.chrome.com/extensions/tabs#method-getSelected
  getActive: () => query({active: true}).then(_.first),
  getUrl: () => API.getActive().then((tab) => tab.url),
  getCurrentUrlBookmarkData: () => {
    return API.getUrl()
    .then(bookmarks.getByUrl)
  },
  getCurrentUrlBookmarkId: () => {
    return API.getCurrentUrlBookmarkData()
    .then((bookmarkData) => bookmarkData && bookmarkData.id)
  }
}

module.exports = API

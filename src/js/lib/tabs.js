const promisify = require('../lib/promisify_chrome')
const create = promisify(chrome.tabs.create, chrome.tabs)
const getSelected = promisify(chrome.tabs.getSelected, chrome.tabs)
const bookmarks = require('./bookmarks')
const _ = require('../lib/utils')

const API = {
  create: create,
  getSelected: getSelected,
  getUrl: () => getSelected().then((tab) => tab.url),
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

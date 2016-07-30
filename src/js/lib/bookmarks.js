const _ = require('../lib/utils')
const promisify = require('./promisify_chrome')
const create = promisify(chrome.bookmarks.create, chrome.bookmarks)
const update = promisify(chrome.bookmarks.update, chrome.bookmarks)
const remove = promisify(chrome.bookmarks.remove, chrome.bookmarks)
const search = promisify(chrome.bookmarks.search, chrome.bookmarks)
const getSubTree = promisify(chrome.bookmarks.getSubTree, chrome.bookmarks)
// let bookmarks_init use it too without rebuilding it
chrome.bookmarks.createAsync = create
const init = require('./bookmarks_init')
const bookmarkTitle = require('./bookmark_title')

const API = {
  search: search,
  updateTitle: (id, title, frequency) => {
    return update(id, {
      title: bookmarkTitle.format(title, frequency, true)
    })
  },
  removeById: remove,
  title: bookmarkTitle
}

module.exports = API

init()
.then((folder) => {
  const { id:folderId } = folder

  API.folder = folderId

  API.isInFolder = (bookmarkData) => bookmarkData && bookmarkData.parentId === folderId

  API.add = (url, title, frequency) => {
    return create({
      parentId: folderId,
      url: url,
      title: bookmarkTitle.format(title, frequency)
    })
    .catch(_.ErrorRethrow('bookmark add'))
  }

  API.getByUrl = (url) => {
    return search({url: url})
    .then((res) => res.filter(API.isInFolder)[0] )
  }
  API.getBookmarkIdByUrl = (url) => {
    return API.getByUrl(url)
    .then((bookmarkData) => bookmarkData && bookmarkData.id)
  }
  API.getAllBookmarksData = () => {
    getSubTree(folderId)
    .then((res) => window.res = res)
  }
})

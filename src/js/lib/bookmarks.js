const _ = require('../lib/utils')
const promisify = require('./promisify_chrome')
const get = promisify(chrome.bookmarks.get, chrome.bookmarks)
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
  getById: (id)=> get(id).then(_.first),
  search: search,
  updateTitle: (id, title, frequency) => {
    return update(id, { title: bookmarkTitle.format(title, frequency, true) })
  },
  removeById: remove,
  parse: (bookmarkData) => {
    const data = bookmarkTitle.parse(bookmarkData.title)
    data.id = bookmarkData.id
    return data
  }
}

module.exports = API

// store the promise
API.waitForFolder = init()
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
  }

  API._getByUrl = (url) => {
    if (!url) {
      throw new Error('url is missing')
    }
    return search({url: url})
    .then((res) => res.filter(API.isInFolder)[0] )
  }
  API._getAllBookmarksData = () => {
    return getSubTree(folderId)
    .then((res) => {
      return res[0].children
      .map(API.parse)
      .sort(sortChronologically)
    })
  }
})

const sortChronologically = (a, b) => a.nextVisit > b.nextVisit

const WaitForFolder = require('./wait_for_folder')(API)
// functions that depend on the bookmark folder id availability
// but need to be directly defined/accessible on the API object
API.getByUrl = WaitForFolder('getByUrl')
API.getAllBookmarksData = WaitForFolder('getAllBookmarksData')

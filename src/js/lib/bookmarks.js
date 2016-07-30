const promisify = require('./promisify_chrome')
const create = promisify(chrome.bookmarks.create, chrome.bookmarks)
const update = promisify(chrome.bookmarks.update, chrome.bookmarks)
const remove = promisify(chrome.bookmarks.remove, chrome.bookmarks)
const search = promisify(chrome.bookmarks.search, chrome.bookmarks)
// let bookmarks_init use it too without rebuilding it
chrome.bookmarks.createAsync = create
const init = require('./bookmarks_init')
const _ = require('../lib/utils')

const API = {
  search: search,
  updateTitle: (id, title, frequency) => {
    return update(id, {
      title: formatTitle(title, frequency)
    })
  },
  removeById: remove
}

module.exports = API

init()
.then((folder) => {
  let { id:folderId } = folder

  API.folder = folderId

  isInFolder = (bookmarkData) => bookmarkData.parentId === folderId

  API.add = (url, title, frequency) => {
    return create({
      parentId: folderId,
      url: url,
      title: formatTitle(title, frequency)
    })
    .catch(_.ErrorRethrow('bookmark add'))
  }

  API.getByUrl = (url) => {
    return search({url: url})
    .then((res) => res.filter(isInFolder)[0] )
  }
  API.getBookmarkIdByUrl = (url) => {
    return API.getByUrl(url)
    .then((bookmarkData) => bookmarkData && bookmarkData.id)
  }
})


function formatTitle (title, frequency) {
  return `${title} ${frequency}`
}

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
  removeById: remove
}

module.exports = API

init()
.then((folder) => {
  let { id:folderId } = folder

  console.log('folderId', folderId)

  API.folder = folderId

  API.add = (url, title) => {
    // console.log('added bookmark', url)
    return create({
      parentId: folderId,
      url: url,
      title: title
    })
    .catch(_.ErrorRethrow('bookmark add err'))
  }

})

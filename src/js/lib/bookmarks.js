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
  _ready: false
}

module.exports = API

init()
.then(function (folder) {
  let { id:folderId } = folder

  API.add = function (url, title) {
    // console.log('added bookmark', url)
    return create({
      parentId: folderId,
      url: url,
      title: title
    })
    .catch(_.ErrorRethrow('bookmark add err'))
  }

  API.removeByUrl = function (url) {
    // console.log('remove bookmark', url)
    return search({url: url})
    .then((res) => remove(res[0].id) )
    .catch(_.ErrorRethrow('bookmark remove err'))
  }

  API.removeById = remove

  API._ready = true
})

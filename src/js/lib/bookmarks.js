const _ = require('./utils')
const promisify = require('./promisify_chrome')
const { bookmarks } = chrome
const get = promisify(bookmarks.get, bookmarks)
const create = promisify(bookmarks.create, bookmarks)
const update = promisify(bookmarks.update, bookmarks)
const remove = promisify(bookmarks.remove, bookmarks)
const search = promisify(bookmarks.search, bookmarks)
const getSubTree = promisify(bookmarks.getSubTree, bookmarks)
// let bookmarks_init use it too without rebuilding it
bookmarks.createAsync = create
const init = require('./bookmarks_init')
const bookmarkTitle = require('./bookmark_title')
const nextVisitIsToday = require('./next_visit_is_today')

const API = {
  getById: id => get(id).then(_.first),
  search,
  updateTitle: (id, title, frequency) => {
    title = bookmarkTitle.format(title, frequency, true)
    return update(id, { title })
  },
  removeById: remove,
  parse: bookmarkData => {
    const data = bookmarkTitle.parse(bookmarkData.title)
    if (data) data.id = bookmarkData.id
    return data
  }
}

module.exports = API

// The init function needs to be called only once, given that even if the bookmark
// folder gets deleted, the folder id remains valid: newly created bookmarks
// will trigger the folder to be re-created

// store the promise
API.waitForFolder = init()
  .then(folder => {
    const { id: folderId } = folder

    API.folder = folderId

    API.isInFolder = bookmarkData => bookmarkData && bookmarkData.parentId === folderId

    API.add = (url, title, frequency) => {
      return create({
        parentId: folderId,
        url,
        title: bookmarkTitle.format(title, frequency)
      })
    }

    // Functions with a '_' prefix are called by `_${name}`
    // in src/js/lib/wait_for_folder.js
    API._getByUrl = url => {
      if (!url) throw new Error('url is missing')
      return search({ url })
      .then(res => res.filter(API.isInFolder)[0])
      .catch(err => {
        // Known case: about: and file: pages in Firefox
        // https://bugzilla.mozilla.org/show_bug.cgi?id=1352835
        console.log('_getByUrl err', { url, err })
      })
    }

    // Could possibly be extracted to become specific to background
    // and not overload the popup
    API._getTodaysBookmarksData = () => {
      return getSubTree(folderId)
      .then(res => {
        if (!(res && res[0])) return []
        return res[0].children
        .map(API.parse)
        .filter(nextVisitIsToday)
      })
    }
  })

const WaitForFolder = require('./wait_for_folder')(API)
// functions that depend on the bookmark folder id availability
// but need to be directly defined/accessible on the API object
API.getByUrl = WaitForFolder('getByUrl')
API.getTodaysBookmarksData = WaitForFolder('getTodaysBookmarksData')

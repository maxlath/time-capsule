const bookmarks = require('./bookmarks')
const storage = require('./storage')
const index = window.indexAPI = require('./index')

module.exports = {
  get: (key) => {
    testKey(key)
    return storage.get(key)
  },
  set: (key, value) => {
    testKey(key)
    index.add(key)
    return storage.set(key, value)
  },
  remove: (key) => {
    testKey(key)
    index.remove(key)
    return storage.remove(key)
  },
  getPeriodicityDataByUrl: (url) => {
    return bookmarks.getBookmarkIdByUrl(url)
    .then((bookmarkId) => bookmarkId && storage.get(bookmarkId) )
  }
}

function testKey (key) {
  if (!/^\d+$/.test(key)) {
    throw new Error(`invalid key: ${key} (${typeof key})`)
  }
}

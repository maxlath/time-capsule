const bookmarks = require('./bookmarks')
const storage = require('../lib/storage')

const Action = (verb) => {
  return (key, value) => {
    testKey(key)
    return storage[verb](key, value)
  }
}

const testKey = (key) => {
  if (!/^\d+$/.test(key)) {
    throw new Error(`invalid key: ${key} (${typeof key})`)
  }
}

module.exports = {
  get: Action('get'),
  set: Action('set'),
  remove: Action('remove'),
  getPeriodicityDataByUrl: (url) => {
    return bookmarks.getBookmarkIdByUrl(url)
    .then((bookmarkId) => bookmarkId && storage.get(bookmarkId) )
  }
}

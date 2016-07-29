const promisify = require('../lib/promisify_chrome')
const store = chrome.storage.sync
const get = promisify(store.get, store)
const set = promisify(store.set, store)
const remove = promisify(store.remove, store)
const clear = promisify(store.clear, store)

module.exports = {
  get: function (key) {
    return get(key)
    .then((res) => res[key] )
  },
  set: function (key, value) {
    const setObject = {}
    setObject[key] = value
    return set(setObject)
  },
  remove: remove,
  clear: clear
}
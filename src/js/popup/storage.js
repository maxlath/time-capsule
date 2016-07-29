const buildKey = (key) => `bp:${key}`

module.exports = {
  get: function (key, callback) {
    chrome.storage.sync.get(buildKey(key), callback)
  },
  set: function (key, value, callback) {
    chrome.storage.sync.set(buildKey(key), value, callback)
  }
}
const _ = require('../lib/utils')
const icon = require('../lib/icon')
const storage = require('../lib/storage')
window.storage = storage

module.exports = function (url) {
  storage.get(url)
  .then(parsePageData)
  .catch(_.ErrorRethrow('onPageUpdate err'))
}

const parsePageData = function (data) {
  if (typeof data === 'object') {
    pageFound(data)
  } else {
    pageDataNotFound(data)
  }
}

const pageFound = function (data) {
  icon.enable(data.days)
}

const pageDataNotFound = function (url) {
  icon.disable()
}

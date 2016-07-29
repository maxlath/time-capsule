const _ = require('../lib/utils')
const icon = require('../lib/icon')
const storage = require('../lib/storage')

module.exports = function (url) {
  storage.get(url)
  .then(parsePageData)
  .catch(_.ErrorRethrow('url change'))
}

const parsePageData = function (data) {
  if (typeof data === 'object') {
    pageFound(data)
  } else {
    pageDataNotFound(data)
  }
}

const pageFound = function (data) {
  icon.enable(data.frequency)
}

const pageDataNotFound = function (url) {
  icon.disable()
}

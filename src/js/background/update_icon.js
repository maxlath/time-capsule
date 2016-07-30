const _ = require('../lib/utils')
const icon = require('../lib/icon')
const periodicityData = require('../lib/periodicity')

module.exports = function (url) {
  periodicityData.getPeriodicityDataByUrl(url)
  .then(parsePeriodicityData)
  .catch(_.ErrorRethrow('url change'))
}

const parsePeriodicityData = function (data) {
  if (data) {
    pageFound(data)
  } else {
    pageDataNotFound(data)
  }
}

const pageFound = function (data) {
  icon.enable(data.freq)
}

const pageDataNotFound = function (url) {
  icon.disable()
}

const _ = require('../lib/utils')
const icon = require('../lib/icon')
const bookmarks = require('../lib/bookmarks')

module.exports = url => {
  bookmarks.getByUrl(url)
  .then(parsePeriodicityData)
  .catch(_.Error('url change'))
}

const parsePeriodicityData = bookmarkData => {
  if (bookmarks.isInFolder(bookmarkData)) pageFound(bookmarkData)
  else pageDataNotFound()
}

const pageFound = bookmarkData => {
  const parsedData = bookmarks.parse(bookmarkData)
  if (parsedData) icon.enable(parsedData.frequency)
  // Known case: if the bookmark title was manually modified and made unparsable
  else icon.disable()
}

const pageDataNotFound = () => icon.disable()

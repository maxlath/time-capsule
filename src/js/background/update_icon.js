const _ = require('../lib/utils')
const icon = require('../lib/icon')
const bookmarks = require('../lib/bookmarks')

module.exports = (url) => {
  bookmarks.getByUrl(url)
  .then(parsePeriodicityData)
  .catch(_.ErrorRethrow('url change'))
}

function parsePeriodicityData (bookmarkData) {
  if (bookmarks.isInFolder(bookmarkData)) {
    pageFound(bookmarkData)
  } else {
    pageDataNotFound()
  }
}

function pageFound (bookmarkData) {
  const titleData = bookmarks.title.parse(bookmarkData.title)
  if (titleData) {
    icon.enable(titleData.frequency)
  } else {
    // known case: if the bookmark title was manually modified and made unparsable
    icon.disable()
  }
}

function pageDataNotFound () {
  icon.disable()
}

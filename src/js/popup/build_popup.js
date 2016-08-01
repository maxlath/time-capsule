const _ = require('../lib/utils')
const bookmarks = require('../lib/bookmarks')

require('./periodicity_options')
require('./footer')
const updateNextVisit = require('./next_visit')

module.exports = function buildPopup (bookmarkData) {
  if (bookmarks.isInFolder(bookmarkData)) {
    const parsedData = bookmarks.parse(bookmarkData)
    if (parsedData) {
      updateNextVisit(parsedData.nextVisit)
      select(`.frequency-${parsedData.frequency}`)
    } else {
      console.error('bookmark in folder but impossible to parse data', bookmarkData)
      select('.never')
    }
  } else {
    select('.never')
  }
}

const select = (selector) => document.querySelector(selector).classList.add('selected')

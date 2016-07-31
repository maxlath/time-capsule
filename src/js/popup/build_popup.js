const _ = require('../lib/utils')
const bookmarks = require('../lib/bookmarks')

require('./periodicity_options')
require('./footer')
const highlightCurrentFrequency = require('./highlight_current_frequency')
const updateNextVisit = require('./next_visit')

module.exports = function buildPopup (bookmarkData) {
  if (bookmarks.isInFolder(bookmarkData)) {
    const parsedData = bookmarks.parse(bookmarkData)
    if (parsedData) {
      updateNextVisit(parsedData.nextVisit)
      highlightCurrentFrequency(parsedData.frequency)
    } else {
      console.error('bookmark in folder but impossible to parse data', bookmarkData)
    }
  }
}

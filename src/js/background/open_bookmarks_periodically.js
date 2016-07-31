// const index = require('../lib/index')
const _ = require('../lib/utils')
const bookmarks = require('../lib/bookmarks')
const openPassedDates = require('./open_passed_dates')


// get all bookmarks periodicity data
// generate a view sorted by time to open
bookmarks.getAllBookmarksData()
.then((sortedBookmarks) => window.sortedBookmarks = sortedBookmarks)
.then(openPassedDates)
// every 10 minutes, check if next bookmark passed its time
// (or alternatively set an alarm on the next bookmark time)
// if so, open the tab, re-set the periodicity data, update the view

const _ = require('../lib/utils')
const bookmarks = require('../lib/bookmarks')
const openPassedDates = require('./open_passed_dates')
const oneDay = require('../lib/times').D

function openTodaysBookmarks () {
  bookmarks.getTodaysBookmarksData()
  .then(openPassedDates)
  .catch(_.Error('openTodaysBookmarks'))
}

openTodaysBookmarks()
setInterval(openTodaysBookmarks, oneDay)

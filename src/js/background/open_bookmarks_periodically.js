const _ = require('../lib/utils')
const bookmarks = require('../lib/bookmarks')
const { schedule, scheduleFromUnparsedBookmark, cancelPending } = require('./schedule')
const { D: oneDay } = require('../lib/times')
const dayEnd = require('../lib/day_end')

const openTodaysBookmarks = () => {
  // this function as the monopoly on setting the day end
  // and every one else simply reading from it
  dayEnd.set()
  bookmarks.getTodaysBookmarksData()
  .then(todaysBookmarks => {
    todaysBookmarks.forEach(schedule.bind(null, _.now()))
  })
  .catch(_.Error('openTodaysBookmarks'))
}

openTodaysBookmarks()
setInterval(openTodaysBookmarks, oneDay)

const reschedule = (id, bookmark) => {
  // Weirdly, the bookmark data is incomplete there:
  // notably, it misses its id and parentId, thus getting it afresh
  bookmarks.getById(id)
  .then(bookmarkData => {
    bookmarks.waitForFolder
    .then(() => {
      if (bookmarks.isInFolder(bookmarkData)) {
        cancelPending(id)
        scheduleFromUnparsedBookmark(bookmarkData)
      }
    })
  })
}

chrome.bookmarks.onCreated.addListener(reschedule)
chrome.bookmarks.onChanged.addListener(reschedule)
chrome.bookmarks.onRemoved.addListener(cancelPending)

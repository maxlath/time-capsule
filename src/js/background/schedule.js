const bookmarks = require('../lib/bookmarks')
const open = require('./open_bookmark')
const _ = require('../lib/utils')
const nextVisitIsToday = require('../lib/next_visit_is_today')

const timeoutIds = {}

function schedule (now, bookmark) {
  const time = bookmark.nextVisit - now
  if (time <= 0) {
    console.log('passed date, opening now:', bookmark)
    open(bookmark)
  } else {
    console.log('in the coming 24 hours:', time, bookmark)
    const { id:bookmarkId } = bookmark
    const openAndClean = () => {
      open(bookmark)
      delete timeoutIds[bookmarkId]
    }
    timeoutIds[bookmarkId] = setTimeout(openAndClean, time)
  }
}

function scheduleFromUnparsedBookmark (unparsedBookmark) {
  const parsedBookmark = bookmarks.parse(unparsedBookmark)
  if (nextVisitIsToday(parsedBookmark)) {
    schedule(_.now(), parsedBookmark)
  }
}

function cancelPending (bookmarkId) {
  console.log('cancelling', bookmarkId, timeoutIds[bookmarkId])
  clearTimeout(timeoutIds[bookmarkId])
}

module.exports = {
  schedule: schedule,
  scheduleFromUnparsedBookmark: scheduleFromUnparsedBookmark,
  cancelPending: cancelPending
}

const _ = require('../lib/utils')
const open = require('./open_bookmark')

module.exports = function openPassedDates (todaysBookmarks) {
  const timeBeforeOpening = TimeBeforeOpening()
  todaysBookmarks.forEach((bookmark) => {
    const time = timeBeforeOpening(bookmark)
    if (time <= 0) {
      console.log('passed date, opening now:', bookmark)
      open(bookmark)
    } else {
      console.log('in the coming 24 hours:', time, bookmark)
      setTimeout(open.bind(null, bookmark), time)
    }
  })
}

function TimeBeforeOpening () {
  // calling _.now only once by batch
  const now = _.now()
  return (bookmark) => bookmark.nextVisit - now
}

const _ = require('../lib/utils')
const tabs = require('../lib/tabs')
const bookmarks = require('../lib/bookmarks')

module.exports = function openPassedDates (sortedBookmarks) {
  const hasPassedDate = HasPassedDate()
  tryNextOne(sortedBookmarks, hasPassedDate)
}

function HasPassedDate () {
  const now = _.now()
  return (bookmarks) => now > bookmarks.nextVisit
}

function tryNextOne (sortedBookmarks, hasPassedDate) {
  const nextBookmark = sortedBookmarks[0]
  if (nextBookmark && hasPassedDate(nextBookmark)) {

    const reverse = removeFromListAndPrepareReverse(sortedBookmarks, nextBookmark)

    open(nextBookmark)
    .then(tryNextOne.bind(null, sortedBookmarks, hasPassedDate))
    .catch(reverse)

  } else {
    console.log('stopping. Next bookmark:', nextBookmark)
  }
}

function removeFromListAndPrepareReverse (sortedBookmarks, nextBookmark) {
  sortedBookmarks.shift()
  return function reverse (err) {
    sortedBookmarks.unshift(nextBookmark)
    throw err
  }
}

function open (bookmark) {
  console.log('opening', bookmark)
  const { id, frequency } = bookmark
  return bookmarks.getById(bookmark.id)
  .then((bookmarkData)=> {
    console.log('bookmarkData', bookmarkData)
    if (bookmarkData) {
      const { title } = bookmarkData
      return tabs.create({url: bookmarkData.url})
      .then(bookmarks.updateTitle.bind(null, id, title, frequency))
    } else {
      console.error('bookmark data not found', bookmark)
    }
  })
}
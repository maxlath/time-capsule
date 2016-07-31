const tabs = require('../lib/tabs')
const bookmarks = require('../lib/bookmarks')

module.exports = function open (bookmark) {
  console.log('opening', bookmark)
  const { id, frequency } = bookmark
  return bookmarks.getById(bookmark.id)
  .then((bookmarkData)=> {
    console.log('bookmarkData', bookmarkData)
    if (bookmarkData) {
      const { title } = bookmarkData
      // open the tab
      return tabs.create({url: bookmarkData.url, active: false})
      // re-set the periodicity data
      .then(bookmarks.updateTitle.bind(null, id, title, frequency))
      // update the view
    } else {
      console.error('bookmark data not found', bookmark)
    }
  })
}
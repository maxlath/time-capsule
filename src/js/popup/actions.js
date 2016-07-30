const icon = require('../lib/icon')
const bookmarks = require('../lib/bookmarks')
const tabs = require('../lib/tabs')
const _ = require('../lib/utils')

module.exports = {
  select: function (e) {
    const frequency = e.target.attributes['data-frequency'].value
    icon.enable(frequency)
    saveCurrentUrlPeriodicity(frequency)
    .then(window.close)
  },
  remove: function () {
    icon.disable()
    tabs.getCurrentUrlBookmarkId()
    .then((bookmarkId) => bookmarks.removeById(bookmarkId))
    .then(window.close)
  }
}

const saveCurrentUrlPeriodicity = (frequency) => {
  return tabs.getCurrentUrlBookmarkData()
  .then((bookmarkData) => {
    let bookmarkId = bookmarkData && bookmarkData.id
    if (bookmarkId) {
      return bookmarks.updateTitle(bookmarkId, bookmarkData.title, frequency)
    } else {
      return tabs.getSelected()
      .then((tabData) => bookmarks.add(tabData.url, tabData.title, frequency) )
    }
  })
}

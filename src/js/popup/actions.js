const icon = require('../lib/icon')
const bookmarks = require('../lib/bookmarks')
const tabs = require('../lib/tabs')
const CelebrateSuccess = require('./celebrate_success')

const setFrequency = frequency => {
  icon.enable(frequency)
  saveCurrentUrlPeriodicity(frequency)
  .then(CelebrateSuccess(frequency))
  .then(window.close)
}

module.exports = {
  setFrequency,
  select: e => setFrequency(e.target.attributes['data-frequency'].value),
  remove: () => {
    icon.disable()
    tabs.getCurrentUrlBookmarkId()
    .then(bookmarkId => {
      if (bookmarkId) bookmarks.removeById(bookmarkId)
    })
    .then(window.close)
  }
}

const saveCurrentUrlPeriodicity = frequency => {
  return tabs.getCurrentUrlBookmarkData()
  .then(bookmarkData => {
    let bookmarkId = bookmarkData && bookmarkData.id
    if (bookmarkId) {
      return bookmarks.updateTitle(bookmarkId, bookmarkData.title, frequency)
    } else {
      return tabs.getActive()
      .then(tabData => bookmarks.add(tabData.url, tabData.title, frequency))
    }
  })
}

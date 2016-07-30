const icon = require('../lib/icon')
const bookmarks = require('../lib/bookmarks')
const tabs = require('../lib/tabs')
const _ = require('../lib/utils')
const periodicity = require('../lib/periodicity')

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
    .then((bookmarkId) => {
      return Promise.all([
        bookmarks.removeById(bookmarkId),
        periodicity.remove(bookmarkId)
      ])
    })
    .then(window.close)
  }
}


const saveCurrentUrlPeriodicity = (frequency) => {
  return tabs.getCurrentUrlBookmarkId()
  .then((bookmarkId) => {
    if (bookmarkId) {
      return setPeriodicityData(bookmarkId, frequency)
    } else {
      return tabs.getSelected()
      .then((tabData) => bookmarks.add(tabData.url, tabData.title) )
      .then((newBookmarkData) => setPeriodicityData(newBookmarkData.id, frequency))
    }
  })
}

const setPeriodicityData = function (bookmarkId, frequency) {
  const data = {
    // keeping keys short as the storage is limited in size
    freq: frequency,
    last: getTimeSeconds(),
  }
  return periodicity.set(bookmarkId, data)
  // return data instead of undefined
  .then(() => data)
}

const getTimeSeconds = () => Math.trunc(new Date().getTime() / 1000)

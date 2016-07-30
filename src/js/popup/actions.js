const icon = require('../lib/icon')
const storage = require('../lib/storage')
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
    tabs.getSelected()
    .then((data) => {
      let { url } = data
      return storage.get(url)
      .then((currentData) => {
        if (typeof currentData !== 'object') { return }
        let { bookmark } = currentData
        return Promise.all([
          bookmarks.removeById(bookmark),
          storage.remove(url)
        ])
      })
    })
    .then(window.close)
  }
}


const saveCurrentUrlPeriodicity = function (frequency) {
  return tabs.getSelected()
  .then(function (data) {
    let { url, title } = data
    return storage.get(url)
    .then((currentData) => {
      if (currentData && currentData.bookmark) {
        return setPeriodicityData(url, frequency, currentData.bookmark)
      } else {
        return bookmarks.add(url, title)
        .then((bookmarkData) => setPeriodicityData(url, frequency, bookmarkData.id))
      }
    })
  })
  .catch(_.ErrorRethrow('saveCurrentUrlPeriodicity'))
}

const setPeriodicityData = function (url, frequency, bookmarkId) {
  let data = {
    frequency: frequency,
    creation: new Date().getTime(),
    bookmark: bookmarkId
  }
  return storage
  .set(url, data)
  // return data instead of undefined
  .then(() => data)
}
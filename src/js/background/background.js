const tabs = require('../lib/tabs')
const urlChange = require('./update_icon')
const _ = require('../lib/utils')
const bookmarks = require('../lib/bookmarks')
const storage = require('../lib/storage')
const periodicity = require('../lib/periodicity')
const icon = require('../lib/icon')

// doc: https://developer.chrome.com/extensions/tabs#event-onUpdated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => urlChange(tab.url))

// doc: https://developer.chrome.com/extensions/tabs#event-onActivated
chrome.tabs.onActivated.addListener((activeInfo) => {
  tabs.getUrl()
  .then(urlChange)
  .catch(_.ErrorRethrow('onActivated'))
})

// keep periodicity data in sync with native bookmarks
chrome.bookmarks.onRemoved.addListener((bookmarkId, removeInfo) => {
  if (bookmarkId === bookmarks.folder) {
    storage.clear()
    icon.disable()
  } else if (removeInfo.parentId === bookmarks.folder) {
    periodicity.remove(bookmarkId)
    updateIcon(removeInfo.node.url)
  }
})

const updateIcon = (removedUrl) => {
  tabs.getUrl()
  .then((currentUrl) => {
    if (currentUrl === removedUrl) {
      icon.disable()
    }
  })
}
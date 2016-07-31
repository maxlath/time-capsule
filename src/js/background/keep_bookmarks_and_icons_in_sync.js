const tabs = require('../lib/tabs')
const updateIcon = require('./update_icon')
const _ = require('../lib/utils')
const bookmarks = require('../lib/bookmarks')
const icon = require('../lib/icon')

// doc: https://developer.chrome.com/extensions/tabs#event-onUpdated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => updateIcon(tab.url))

// doc: https://developer.chrome.com/extensions/tabs#event-onActivated
chrome.tabs.onActivated.addListener((activeInfo) => {
  tabs.getUrl()
  .then(updateIcon)
  .catch(_.ErrorRethrow('onActivated'))
})

// keep periodicity data in sync with native bookmarks
chrome.bookmarks.onRemoved.addListener((bookmarkId, removeInfo) => {
  if (bookmarkId === bookmarks.folder) {
    icon.disable()
  } else if (removeInfo.parentId === bookmarks.folder) {
    disableIconFromUrl(removeInfo.node.url)
  }
})

function disableIconFromUrl (removedUrl) {
  tabs.getUrl()
  .then((currentUrl) => {
    if (currentUrl === removedUrl) {
      icon.disable()
    }
  })
}

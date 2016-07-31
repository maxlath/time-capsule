const icon = require('../lib/icon')
const tabs = require('../lib/tabs')
const bookmarks = require('../lib/bookmarks')
const updateIcon = require('./update_icon')
const _ = require('../lib/utils')

// On update of any tab, if it is the current tab, update the icon
// doc: https://developer.chrome.com/extensions/tabs#event-onUpdated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log('changeInfo', changeInfo)
  tabs.getActive()
  .then((activeTab) => {
    if (activeTab.id === tabId) {
      updateIcon(tab.url)
    }
  })
})

// When a tab becomes the active tab, update the icon
// doc: https://developer.chrome.com/extensions/tabs#event-onActivated
chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log('activeInfo', activeInfo)
  tabs.getUrl()
  .then(updateIcon)
  .catch(_.Error('onActivated'))
})

// Update the icon when a bookmark is deleted
// doc: https://developer.chrome.com/extensions/bookmarks#event-onRemoved
chrome.bookmarks.onRemoved.addListener((bookmarkId, removeInfo) => {
  if (bookmarkId === bookmarks.folder) {
    icon.disable()
  } else if (removeInfo.parentId === bookmarks.folder) {
    // disable icon if the removed bookmark matches the current tab
    tabs.getUrl()
    .then((currentUrl) => {
      if (currentUrl === removeInfo.node.url) {
        icon.disable()
      }
    })
  }
})

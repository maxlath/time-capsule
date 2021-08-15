import { disable } from '../lib/icon'
import { getActive, getUrl } from '../lib/tabs'
import { folderId } from '../lib/bookmarks'
import updateIcon from './update_icon'
import { Error } from '../lib/utils'

// On update of any tab, if it is the current tab, update the icon
// doc: https://developer.chrome.com/extensions/tabs#event-onUpdated
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const { url: changedTabUrl } = changeInfo
  // A tab loading sends several update events but only one contains a url,
  // thus taking only this one event in account allows to debounce icon updates
  if (!changedTabUrl) return
  getActive()
  .then(activeTab => {
    if (activeTab.id === tabId) updateIcon(changedTabUrl)
  })
})

// When a tab becomes the active tab, update the icon
// doc: https://developer.chrome.com/extensions/tabs#event-onActivated
browser.tabs.onActivated.addListener(activeInfo => {
  getUrl()
  .then(updateIcon)
  .catch(Error('onActivated'))
})

// Update the icon when a bookmark is deleted
// doc: https://developer.chrome.com/extensions/bookmarks#event-onRemoved
browser.bookmarks.onRemoved.addListener((bookmarkId, removeInfo) => {
  if (bookmarkId === folderId) {
    disable()
  } else {
    // disable icon if the removed bookmark matches the current tab
    getUrl()
    .then(currentUrl => {
      if (currentUrl === removeInfo.node.url) disable()
    })
  }
})

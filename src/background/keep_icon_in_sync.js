import { disable } from '../lib/icon.js'
import { getActive, getUrl } from '../lib/tabs.js'
import { folderId } from '../lib/bookmarks.js'
import { updateIcon } from './update_icon.js'

// On update of any tab, if it is the current tab, update the icon
// doc: https://developer.chrome.com/extensions/tabs#event-onUpdated
async function onTabUpdated (tabId, changeInfo, tab) {
  try {
    const { url: changedTabUrl } = changeInfo
    // A tab loading sends several update events but only one contains a url,
    // thus taking only this one event in account allows to debounce icon updates
    if (!changedTabUrl) return
    const activeTab = await getActive()
    // activeTab might be undefined?!?
    if (activeTab.id === tabId) await updateIcon(changedTabUrl)
  } catch (err) {
    console.error('onTabUpdated', err)
  }
}

// When a tab becomes the active tab, update the icon
// doc: https://developer.chrome.com/extensions/tabs#event-onActivated
async function onTabActivated (activeInfo) {
  try {
    const url = await getUrl()
    await updateIcon(url)
  } catch (err) {
    console.error('onTabActivated', err)
  }
}

// Update the icon when a bookmark is deleted
// doc: https://developer.chrome.com/extensions/bookmarks#event-onRemoved
async function onRemovedBookmark (bookmarkId, removeInfo) {
  try {
    if (bookmarkId === folderId) {
      await disable()
    } else {
      // disable icon if the removed bookmark matches the current tab
      const currentUrl = await getUrl()
      if (currentUrl === removeInfo.node.url) await disable()
    }
  } catch (err) {
    console.error('onRemovedBookmark', err)
  }
}

browser.tabs.onUpdated.addListener(onTabUpdated)
browser.tabs.onActivated.addListener(onTabActivated)
browser.bookmarks.onRemoved.addListener(onRemovedBookmark)

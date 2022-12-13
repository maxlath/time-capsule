import { disable } from '../lib/icon.js'
import { getActiveTab, getActiveTabUrl } from '../lib/tabs.js'
import { folderId, getBookmarkById, getCapsuleBookmarkByUrl } from '../lib/bookmarks.js'
import { updateIconFromBookmark, updateIconFromUrl } from './update_icon.js'

let activeTabId, activeTabBookmarkUrl, activeTabBookmarkId

// On update of any tab, if it is the current tab, update the icon
// doc: https://developer.chrome.com/extensions/tabs#event-onUpdated
async function onTabUpdated (tabId, changeInfo, tab) {
  const { url: changedTabUrl } = changeInfo
  // A tab loading sends several update events but only one contains a url,
  // thus taking only this one event in account allows to debounce icon updates
  if (!changedTabUrl) return
  const activeTab = await getActiveTab()
  // activeTab might be undefined?!?
  if (activeTab.id === tabId) {
    const bookmark = await getCapsuleBookmarkByUrl(changedTabUrl)
    activeTabBookmarkId = bookmark?.id
    activeTabBookmarkUrl = bookmark?.url
    activeTabId = tabId
    await updateIconFromBookmark({ bookmark, tabId })
  }
}

// When a tab becomes the active tab, update the icon
// doc: https://developer.chrome.com/extensions/tabs#event-onActivated
async function onTabActivated (activeTab) {
  const { tabId } = activeTab
  const url = await getActiveTabUrl()
  activeTabId = tabId
  const bookmark = await getCapsuleBookmarkByUrl(url)
  activeTabBookmarkId = bookmark?.id
  activeTabBookmarkUrl = bookmark?.url
  await updateIconFromBookmark({ bookmark, tabId })
}

// Update the icon when a bookmark is deleted
// doc: https://developer.chrome.com/extensions/bookmarks#event-onRemoved
async function onRemovedBookmark (bookmarkId, removeInfo) {
  if (bookmarkId === folderId) {
    await disable()
  } else {
    // disable icon if the removed bookmark matches the current tab
    const currentUrl = await getActiveTabUrl()
    if (currentUrl === removeInfo.node.url) await disable()
  }
}

async function onCreatedBookmark (bookmarkId, bookmarkInfo) {
  if (activeTabBookmarkUrl === bookmarkInfo.url) {
    activeTabBookmarkId = bookmarkId
    await fetchBookmarkAndUpdateIcon(bookmarkId)
  }
}

async function onUpdatedBookmark (bookmarkId) {
  if (activeTabBookmarkId === bookmarkId) {
    await fetchBookmarkAndUpdateIcon(bookmarkId)
  }
}

async function fetchBookmarkAndUpdateIcon (bookmarkId) {
  const bookmark = await getBookmarkById(bookmarkId)
  await updateIconFromBookmark({ bookmark, tabId: activeTabId })
}

// const lazyOnUpdatedBookmark = debounce(onUpdatedBookmark, 100)

async function onRuntimeMessage (message) {
  const { event } = message
  if (event === 'popup-updated-capsule' || event === 'popup-deleted-capsule') {
    const activeTab = await getActiveTab()
    await updateIconFromUrl({ url: activeTab.url, tabId: activeTab.id })
  } else {
    console.error('unknown runtime message', message)
  }
}

browser.tabs.onUpdated.addListener(onTabUpdated)
browser.tabs.onActivated.addListener(onTabActivated)
browser.bookmarks.onRemoved.addListener(onRemovedBookmark)
browser.bookmarks.onCreated.addListener(onCreatedBookmark)
browser.bookmarks.onChanged.addListener(onUpdatedBookmark)
browser.bookmarks.onMoved.addListener(onUpdatedBookmark)
browser.runtime.onMessage.addListener(onRuntimeMessage)

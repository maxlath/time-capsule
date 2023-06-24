import { initContextMenus } from './context_menu.js'
import './keep_icon_in_sync'
import './schedule_incoming_bookmarks.js'

// Clear possiblyOutdatedBookmarkData storage at session start
browser.storage.local.remove('possiblyOutdatedBookmarkData')

browser.commands.onCommand.addListener(command => {
  if (command === 'open-periodicity-menu') {
    browser.browserAction.openPopup()
  } else if (command === 'open-periodicity-settings') {
    browser.tabs.create({ url: '/settings/settings.html' })
  }
})

initContextMenus()

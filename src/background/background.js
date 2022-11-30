import './keep_icon_in_sync'
import './open_bookmarks_periodically'

browser.commands.onCommand.addListener(command => {
  if (command === 'open-periodicity-menu') {
    browser.browserAction.openPopup()
  }
})

const browserAction = require('../lib/browser_action')

require('./keep_icon_in_sync')
require('./open_bookmarks_periodically')

chrome.commands.onCommand.addListener(command => {
  if (command === 'open-periodicity-menu') {
    browserAction.openPopup()
    // If open popup throws an error, it's probably that a popup is already opened
    // in which case, the command is interpreted as 'close the popup'
    .catch(browserAction.closePopup)
  }
})

const browserAction = require('../lib/browser_action')

require('./keep_icon_in_sync')
require('./open_bookmarks_periodically')

chrome.commands.onCommand.addListener((command) => {
  if (command === 'open-periodicity-menu') {
    browserAction.openPopup()
  }
})

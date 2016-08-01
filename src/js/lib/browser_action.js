const promisify = require('../lib/promisify_chrome')
const openPopup = promisify(chrome.browserAction.openPopup, chrome.browserAction)

module.exports = {
  openPopup: openPopup
}
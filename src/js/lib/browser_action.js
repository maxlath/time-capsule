const promisify = require('../lib/promisify_chrome')
const openPopup = promisify(chrome.browserAction.openPopup, chrome.browserAction)

module.exports = {
  openPopup: openPopup,
  closePopup: () => {
    chrome.extension.getViews({type: "popup"})[0].close()
  }
}
const promisify = require('../lib/promisify_chrome')
const getOpenPopup = () => {
  if (chrome.browserAction.openPopup) {
    return promisify(chrome.browserAction.openPopup, chrome.browserAction)
  } else {
    return {}
  }
}

module.exports = {
  openPopup: getOpenPopup(),
  closePopup: () => {
    const popup = chrome.extension.getViews({ type: 'popup' })[0]
    if (popup) popup.close()
  }
}

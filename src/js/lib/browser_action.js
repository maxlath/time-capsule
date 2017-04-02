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
    const views = chrome.extension.getViews({type: 'popup'})
    views[0] && views[0].close()
  }
}

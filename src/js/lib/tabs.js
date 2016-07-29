const promisify = require('../lib/promisify_chrome')
const getSelected = promisify(chrome.tabs.getSelected, chrome.tabs)

module.exports = {
  getSelected: getSelected,
  getUrl: () => getSelected().then((tab) => tab.url)
}

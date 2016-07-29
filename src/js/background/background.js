const tabs = require('../lib/tabs')
const urlChange = require('./url_change')
const _ = require('../lib/utils')

// doc: https://developer.chrome.com/extensions/tabs#event-onUpdated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => urlChange(tab.url))

// doc: https://developer.chrome.com/extensions/tabs#event-onActivated
chrome.tabs.onActivated.addListener((activeInfo) => {
  tabs.getUrl()
  .then(urlChange)
  .catch(_.ErrorRethrow('onPageUpdate err'))
})

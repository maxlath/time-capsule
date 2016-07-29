const tabs = require('../lib/tabs')
const urlChange = require('./url_change')
const _ = require('../lib/utils')

const onUpdatedTab = function (tabId, changeInfo, tab) {
  console.log('changeInfo', changeInfo)
  var url = tab.url
  urlChange(url)
}

// doc: https://developer.chrome.com/extensions/tabs#event-onUpdated
chrome.tabs.onUpdated.addListener(onUpdatedTab)

onActivatedUpdate = function (activeInfo) {
  console.log('activeInfo', activeInfo)
  tabs.getUrl()
  .then(urlChange)
  .catch(_.Error('onPageUpdate err'))
}

// doc: https://developer.chrome.com/extensions/tabs#event-onActivated
chrome.tabs.onActivated.addListener(onActivatedUpdate)

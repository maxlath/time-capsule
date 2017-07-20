const tabs = require('./tabs')
const darkGrey = '#333333'

// It could theorically be possible to check a lastFrequency variable to know
// if an update is needed, but this would involve manipulating this variable
// from both the background and the popup context, (for instance, by setting on this
// variable on background global window object via chrome.extension.getBackgroundPage())
// but that would be more pain than gains
module.exports = {
  enable: frequency => {
    tabs.getCurrentTabId()
    .then(tabId => {
      const text = formatFrequency(frequency)
      setActiveIcon(tabId)
      chrome.browserAction.setBadgeText({ tabId, text })
      chrome.browserAction.setBadgeBackgroundColor({ tabId, color: darkGrey })
    })
  },
  disable: () => {
    tabs.getCurrentTabId()
    .then(tabId => {
      setDisableIcon(tabId)
      chrome.browserAction.setBadgeText({ tabId, text: '' })
    })
  }
}

const setStatusIcon = substring => tabId => {
  chrome.browserAction.setIcon({
    tabId,
    path: {
      32: `/icons/time-capsule-${substring}32.png`,
      48: `/icons/time-capsule-${substring}48.png`,
      92: `/icons/time-capsule-${substring}92.png`
    }
  })
}

const setActiveIcon = setStatusIcon('')
const setDisableIcon = setStatusIcon('disabled-')

const formatFrequency = freq => freq.slice(0, -1) + ' ' + freq.slice(-1)

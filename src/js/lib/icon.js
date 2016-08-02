// It could theorically be possible to check a lastFrequency variable to know
// if an update is needed, but this would involve manipulating this variable
// from both the background and the popup context, (for instance, by setting on this
// variable on background global window object via chrome.extension.getBackgroundPage())
// but that would be more pain than gains
module.exports = {
  enable: function (frequency) {
    setIcon('')
    chrome.browserAction.setBadgeText({ text: formatFrequency(frequency) })
  },
  disable: function () {
    setIcon('disabled-')
    chrome.browserAction.setBadgeText({ text: '' })
  }
}

function setIcon (substring) {
  chrome.browserAction.setIcon({
    path: {
      48: `/icons/time-capsule-${substring}48.png`,
      92: `/icons/time-capsule-${substring}92.png`
    }
  })
}

const formatFrequency = (freq) => freq.slice(0, -1) + ' ' + freq.slice(-1)

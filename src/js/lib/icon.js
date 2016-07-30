const setIcon = function (substring) {
  chrome.browserAction.setIcon({
    path: {
      48: `/icons/browse-periodically-${substring}48.png`,
      92: `/icons/browse-periodically-${substring}92.png`
    }
  })
}

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


const formatFrequency = (freq) => freq.slice(0, -1) + ' ' + freq.slice(-1)

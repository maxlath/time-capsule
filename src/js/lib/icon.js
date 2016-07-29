const setIcon = function (substring) {
  chrome.browserAction.setIcon({
    path: {
      48: `/icons/browse-periodically-${substring}48.png`,
      92: `/icons/browse-periodically-${substring}92.png`
    }
  })
}

module.exports = {
  enable: function (days) {
    setIcon('')
    chrome.browserAction.setBadgeText({ text: days })
  },
  disable: function () {
    setIcon('disabled-')
    chrome.browserAction.setBadgeText({ text: '' })
  }
}

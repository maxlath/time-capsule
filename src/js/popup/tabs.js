module.exports = {
  getUrl: function (fn) {
    chrome.tabs.getSelected((tab) => fn(tab.url) )
  }
}
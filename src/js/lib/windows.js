const { windows } = chrome
const promisify = require('./promisify_chrome')
const getLastWindowFocused = promisify(windows.getLastFocused, windows)

module.exports = {
  getLastFocusedId: () => getLastWindowFocused().then(data => data.id)
}

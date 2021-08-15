export function getLastFocusedId () {
  return browser.windows.getLastFocused().then(data => data.id)
}

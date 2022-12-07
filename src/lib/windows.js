export async function getLastFocusedWindowId () {
  const data = await browser.windows.getLastFocused()
  return data.id
}

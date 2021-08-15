const getOpenPopup = () => {
  if (browser.browserAction.openPopup) {
    return browser.browserAction.openPopup()
  } else {
    return {}
  }
}

export const openPopup = getOpenPopup()

export function closePopup () {
  const popup = browser.extension.getViews({ type: 'popup' })[0]
  if (popup) popup.close()
}

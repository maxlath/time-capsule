import { getActiveTabId } from './tabs.js'
const darkGrey = '#333333'
const warningBgColor = '#ffd402'

// It could theorically be possible to check a lastFrequency variable to know
// if an update is needed, but this would involve manipulating this variable
// from both the background and the popup context, (for instance, by setting on this
// variable on background global window object via browser.extension.getBackgroundPage())
// but that would be more pain than gains
export async function enable (frequency, options = {}) {
  const tabId = await getActiveTabId()
  setActiveIcon(tabId)
  if (options.warning) {
    browser.browserAction.setBadgeText({ tabId, text: '!' })
    // Requires manifest_version=3
    // browser.browserAction.setBadgeTextColor({ tabId, color: '#ff0000' })
    browser.browserAction.setBadgeBackgroundColor({ tabId, color: warningBgColor })
  } else {
    const text = formatFrequency(frequency)
    browser.browserAction.setBadgeText({ tabId, text })
    browser.browserAction.setBadgeBackgroundColor({ tabId, color: darkGrey })
  }
}

export async function disable () {
  const tabId = await getActiveTabId()
  setDisableIcon(tabId)
  browser.browserAction.setBadgeText({ tabId, text: '' })
}

const setStatusIcon = substring => tabId => {
  browser.browserAction.setIcon({
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

import { getActiveTabId } from './tabs.js'
import { getNextVisitSummary } from './times.js'
import { sleep, usesDarkMode } from './utils.js'
const darkGrey = '#333333'
const warningBgColor = '#ffd402'
const successBgColor = '#00ff00'

// It could theorically be possible to check a lastFrequency variable to know
// if an update is needed, but this would involve manipulating this variable
// from both the background and the popup context, (for instance, by setting on this
// variable on background global window object via browser.extension.getBackgroundPage())
// but that would be more pain than gains
export async function enable ({ frequency, warning, nextVisit }) {
  const tabId = await getActiveTabId()
  if (frequency) {
    setPeriodicCapsuleIcon(tabId)
  } else {
    setOneTimeCapsuleIcon(tabId)
  }
  if (warning) {
    browser.browserAction.setBadgeText({ tabId, text: '!' })
    // Requires manifest_version=3
    // browser.browserAction.setBadgeTextColor({ tabId, color: '#ff0000' })
    browser.browserAction.setBadgeBackgroundColor({ tabId, color: warningBgColor })
  } else {
    browser.browserAction.setBadgeText({ tabId, text: frequency || getNextVisitSummary(nextVisit) })
    browser.browserAction.setBadgeBackgroundColor({ tabId, color: darkGrey })
  }
}

export async function disable () {
  const tabId = await getActiveTabId()
  setDisableIcon(tabId)
  browser.browserAction.setBadgeText({ tabId, text: '' })
}

let lastIcon
const setStatusIcon = substring => async tabId => {
  lastIcon = substring
  // TODO: also set title with browser.browserAction.setTitle
  browser.browserAction.setIcon({
    tabId,
    path: {
      32: `/icons/time-capsule-${substring}32.png`,
      48: `/icons/time-capsule-${substring}48.png`,
      92: `/icons/time-capsule-${substring}92.png`
    }
  })
}

const useLightIcons = usesDarkMode()

const setPeriodicCapsuleIcon = setStatusIcon('')
const setOneTimeCapsuleIcon = setStatusIcon('yellow-')
const setDisableIcon = setStatusIcon(useLightIcons ? 'disabled-light-' : 'disabled-')

export async function flashSuccessIcon () {
  const tabId = await getActiveTabId()
  const currentStatusIcon = lastIcon
  const [
    text,
    color,
    bgColor,
  ] = await Promise.all([
    browser.browserAction.getBadgeText({ tabId }),
    browser.browserAction.getBadgeTextColor({ tabId }),
    browser.browserAction.getBadgeBackgroundColor({ tabId }),
  ])
  await Promise.all([
    setPeriodicCapsuleIcon(tabId),
    browser.browserAction.setBadgeText({ tabId, text: '✔' }),
    browser.browserAction.setBadgeTextColor({ tabId, color: '#ffffff' }),
    browser.browserAction.setBadgeBackgroundColor({ tabId, color: successBgColor }),
  ])
  await sleep(500)
  await Promise.all([
    setStatusIcon(currentStatusIcon)(tabId),
    browser.browserAction.setBadgeText({ tabId, text }),
    browser.browserAction.setBadgeTextColor({ tabId, color }),
    browser.browserAction.setBadgeBackgroundColor({ tabId, color: bgColor }),
  ])
}

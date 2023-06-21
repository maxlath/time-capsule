import { getActiveTabId } from './tabs.js'
import { getNextVisitSummary } from './times.js'
import { sleep, usesDarkMode } from './utils.js'
const darkGrey = '#333333'
const warningBgColor = '#ffd402'
const errorBgColor = '#ff0000'
const successBgColor = '#00ff00'
const white = '#ffffff'

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

const prefixByStatus = {
  default: '',
  oneTime: 'yellow-',
  disabled: 'disabled-',
}

const useLightIcons = usesDarkMode()

let lastIconStatus
const setStatusIcon = async ({ status, tabId }) => {
  lastIconStatus = status
  let suffix = prefixByStatus[status]
  if (status === 'disabled' && useLightIcons) suffix = 'disabled-light-'
  // TODO: also set title with browser.browserAction.setTitle
  browser.browserAction.setIcon({
    tabId,
    path: {
      32: `/icons/time-capsule-${suffix}32.png`,
      48: `/icons/time-capsule-${suffix}48.png`,
      92: `/icons/time-capsule-${suffix}92.png`
    }
  })
}

const setPeriodicCapsuleIcon = tabId => setStatusIcon({ status: 'default', tabId })
const setOneTimeCapsuleIcon = tabId => setStatusIcon({ status: 'oneTime', tabId })
const setDisableIcon = tabId => setStatusIcon({ status: 'disabled', tabId })

async function flashIcon ({ iconStatus, text, color, bgColor }) {
  const tabId = await getActiveTabId()
  const currentStatusIcon = lastIconStatus
  const [
    textBefore,
    colorBefore,
    bgColorBefore,
  ] = await Promise.all([
    browser.browserAction.getBadgeText({ tabId }),
    browser.browserAction.getBadgeTextColor({ tabId }),
    browser.browserAction.getBadgeBackgroundColor({ tabId }),
  ])
  await Promise.all([
    setStatusIcon({ status: iconStatus, tabId }),
    browser.browserAction.setBadgeText({ tabId, text }),
    browser.browserAction.setBadgeTextColor({ tabId, color }),
    browser.browserAction.setBadgeBackgroundColor({ tabId, color: bgColor }),
  ])
  await sleep(500)
  await Promise.all([
    setStatusIcon({ status: currentStatusIcon, tabId }),
    browser.browserAction.setBadgeText({ tabId, text: textBefore }),
    browser.browserAction.setBadgeTextColor({ tabId, color: colorBefore }),
    browser.browserAction.setBadgeBackgroundColor({ tabId, color: bgColorBefore }),
  ])
}

export async function flashSuccessIcon () {
  await flashIcon({
    iconStatus: 'default',
    text: '✔',
    color: white,
    bgColor: successBgColor,
  })
}

export async function flashFailureIcon () {
  await flashIcon({
    iconStatus: 'disabled',
    text: '⨯',
    color: white,
    bgColor: errorBgColor,
  })
}

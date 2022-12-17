import { writable, get } from 'svelte/store'

const stores = {}

const defaultSettings = {
  'settings:allowDuplicatedTabs': false,
  'settings:defaultRepeats': '∞',
  'settings:maxCapsules': 10,
  'settings:logsMaxRecords': 100,
  'settings:keepExpiredCapsulesAsNormalBookmarks': false,
  'settings:enableNoCapsuleTimes': false,
  'settings:blockedWeekTimes': {},
}

const defaultValues = {
  ...defaultSettings,
  'settings:selectedTab': 'preferences',
  'popup:selectedTab': 'periodical',
}

export function getSettingStore (key) {
  stores[key] = stores[key] || initStore(key)
  return stores[key]
}

function initStore (key) {
  checkKeyStatus(key)
  const start = () => {
    const stop = () => delete stores[key]
    return stop
  }
  const store = writable(null, start)

  browser.storage.local.get(key)
  .then(({ [key]: value }) => {
    if (value != null) store.set(value)
    else store.set(defaultValues[key])
  })
  .catch(console.error)

  return {
    set (value) {
      browser.storage.local.set({ [key]: value }).catch(console.error)
      store.set(value)
    },
    subscribe: store.subscribe,
  }
}

// See https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/onChanged
browser.storage.local.onChanged.addListener(changes => {
  for (const [ key, { newValue } ] of Object.entries(changes)) {
    if (stores[key] != null) {
      const currentValue = get(stores[key])
      if (!isEqual(currentValue, newValue)) stores[key].set(newValue)
    }
  }
})

const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b)

export async function getSettingValue (key) {
  checkKeyStatus(key)
  const { [key]: value } = await browser.storage.local.get(key)
  return value != null ? value : defaultValues[key]
}

const checkKeyStatus = key => {
  if (defaultValues[key] == null) throw new Error(`unknown setting key: ${key}`)
}

export async function restoreDefaultSettings () {
  await browser.storage.local.set(defaultSettings)
}

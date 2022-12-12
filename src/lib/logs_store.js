import { readable } from 'svelte/store'
import { getLogRecords } from './logs.js'

export const logsStore = readable(null, function start (set) {
  getLogRecords().then(records => set(records))
  const onStorageChange = changes => {
    if (changes.logs != null) {
      set(changes.logs.newValue)
    }
  }
  browser.storage.local.onChanged.addListener(onStorageChange)
  return function stop () {
    browser.storage.local.onChanged.removeListener(onStorageChange)
  }
})

import { writable } from 'svelte/store'

const stores = {}

export function getSettingStore (key, initialValue) {
  stores[key] = stores[key] || initStore(key, initialValue)
  return stores[key]
}

function initStore (key, initialValue) {
  const start = () => {
    const stop = () => delete stores[key]
    return stop
  }
  const store = writable(initialValue, start)

  browser.storage.sync.get(key)
  .then(({ [key]: value }) => {
    if (value != null) store.set(value)
  })
  .catch(console.error)

  return {
    set (value) {
      browser.storage.sync.set({ [key]: value }).catch(console.error)
      store.set(value)
    },
    subscribe: store.subscribe,
  }
}

import Popup from './Popup.svelte'

new Popup({
  target: document.querySelector('main'),
  props: {}
})

// The popup is coupled to the URL when it was opened
// so if that changes, it should be reopened
browser.tabs.onActivated.addListener(() => window.close())
browser.tabs.onUpdated.addListener(() => window.close())

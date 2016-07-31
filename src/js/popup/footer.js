const i18n = require('../lib/i18n')
const buildElement = require('../lib/element')
const actions = require('./actions')
const footerEl = document.querySelector('#footer')

// build div.remove  + click event listener
const removeEl = buildElement({
  tagName: 'div',
  className: 'remove',
  text: i18n('remove'),
  appendTo: footerEl
})

removeEl.addEventListener('click', actions.remove)

// build div.settings
const settingsEl = buildElement({
  tagName: 'div',
  className: 'settings',
  text: i18n('settings'),
  appendTo: footerEl
})

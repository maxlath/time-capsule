const i18n = require('../lib/i18n')
const buildElement = require('../lib/element')
const actions = require('./actions')
const footerEl = document.querySelector('#footer')
const { matrix } = require('./matrix')

// build div.remove  + click event listener
const neverEl = buildElement({
  tagName: 'div',
  className: 'never',
  text: i18n('never'),
  appendTo: footerEl,
  attributes: { title: '[Suppr]' }
})

neverEl.addEventListener('click', actions.remove)
// let the time to .custom element to be added before
setTimeout(() => {
  neverEl.place = {
    row: matrix.length,
    column: 0
  }
  matrix.push([neverEl])
}, 100)

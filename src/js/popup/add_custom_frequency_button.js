const buildElement = require('../lib/element')
const i18n = require('../lib/i18n')
const { matrix } = require('./matrix')

module.exports = periodicityOptionsEl => {
  return function addCustomFrequencyButton () {
    const customEl = buildElement({
      tagName: 'div',
      className: 'custom selected',
      text: i18n('custom'),
      appendTo: periodicityOptionsEl,
      // When selected, we keep the same custom setting
      // It seems that contrary to what happens in the actions module,
      // binding the window object is required to avoid "Illegal invocation" errors
      onClick: window.close.bind(window)
    })
    customEl.place = {
      row: matrix.length,
      column: 0
    }
    matrix.push([customEl])
  }
}

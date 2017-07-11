const i18n = require('../lib/i18n')
const buildElement = require('../lib/element')
const nextVisitEl = document.querySelector('#nextVisit')

module.exports = function updateNextVisit (date) {
  buildElement({
    tagName: 'h2',
    text: i18n('next_visit'),
    appendTo: nextVisitEl
  })

  buildElement({
    tagName: 'p',
    text: new Date(date).toLocaleString(),
    appendTo: nextVisitEl
  })
}

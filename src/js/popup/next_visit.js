const i18n = require('../lib/i18n')
const nextVisitHeaderEl = document.querySelector('#nextVisitHeader')
const nextVisitEl = document.querySelector('#nextVisit')

module.exports = function updateNextVisit (date) {
  nextVisitHeaderEl.textContent = i18n('next_visit')
  nextVisitEl.textContent = new Date(date).toLocaleString()
}


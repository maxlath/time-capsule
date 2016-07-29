const i18n = chrome.i18n.getMessage.bind(chrome.i18n)

module.exports = [
  { days: 1, label: i18n('1_day') },
  { days: 3, label: i18n('days', ['3']) },
  { days: 7, label: i18n('1_week') },
  { days: 28, label: i18n('weeks', ['4']) }
]
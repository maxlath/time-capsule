const i18n = chrome.i18n.getMessage.bind(chrome.i18n)
const element = require('../lib/element')
const options = require('./options')
const icon = require('../lib/icon')
const storage = require('../lib/storage')
const tabs = require('../lib/tabs')
const _ = require('../lib/utils')

var container = document.querySelector('.container')

element({
  el: 'span',
  className: 'browse-every',
  text: i18n('browse_every'),
  appendTo: container
})

selectOption = function (e) {
  var days = e.target.attributes['data-days'].value
  icon.enable(days)
  saveCurrentUrlPeriodicity(days)
}

const saveCurrentUrlPeriodicity = function (days) {
  tabs.getUrl()
  .then(function (url) {
    return storage.set(url, {
      days: days,
      creation: new Date().getTime()
    })
  })
  .catch(_.Error('saveCurrentUrlPeriodicity err'))
}

options.forEach(function (option) {
  element({
    el: 'div',
    className: 'option',
    text: option.label,
    attributes: {
      'data-days': option.days
    },
    appendTo: container,
    onClick: selectOption
  })
})

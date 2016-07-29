const i18n = chrome.i18n.getMessage.bind(chrome.i18n)
const element = require('../lib/element')
const icon = require('./icon')
const options = require('./options')
const tabs = require('./tabs')
const storage = require('./storage')

var container = document.querySelector('.container')

element({
  el: 'span',
  className: 'browse-every',
  text: i18n('browse_every'),
  appendTo: container
})

selectOption = function (e) {
  var days = e.target.attributes['data-days'].value
  chrome.browserAction.setBadgeText({ text: days })
  icon.enable()
}

const saveCurrentUrlPeriodicity = function (days) {
  getUrl(function (url) {
    storage.set(url, {
      days: days
    })
  })
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

icon.disable()

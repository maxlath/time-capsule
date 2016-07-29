const i18n = chrome.i18n.getMessage.bind(chrome.i18n)
const element = require('../lib/element')
const options = require('./options')
const icon = require('../lib/icon')
const storage = require('../lib/storage')
const bookmarks = require('../lib/bookmarks')
const tabs = require('../lib/tabs')
const _ = require('../lib/utils')
const container = document.querySelector('.container')
const remove = document.querySelector('.remove')
const actions = require('./actions')

element({
  el: 'span',
  className: 'browse-every',
  text: i18n('browse_every'),
  appendTo: container
})

options.forEach(function (option) {
  element({
    el: 'div',
    className: 'option',
    text: option.label,
    attributes: {
      'data-days': option.days
    },
    appendTo: container,
    onClick: actions.select
  })
})

remove.addEventListener('click', actions.remove)

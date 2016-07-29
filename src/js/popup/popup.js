const i18n = chrome.i18n.getMessage.bind(chrome.i18n)
const element = require('../lib/element')
const options = require('./options')
const icon = require('../lib/icon')
const storage = require('../lib/storage')
const bookmarks = require('../lib/bookmarks')
const tabs = require('../lib/tabs')
const _ = require('../lib/utils')
const remove = document.querySelector('.remove')
const actions = require('./actions')

const containerEl = document.querySelector('.container')

element({
  tagName: 'span',
  className: 'browse-every',
  text: i18n('browse_every'),
  appendTo: containerEl
})

const optionsContainers = {}
const categoriesList = Object.keys(options)

categoriesList.forEach((category) => {
  let categoryEl = element({
    tagName: 'div',
    id: category,
    className: 'category',
    appendTo: containerEl
  })

  element({
    tagName: 'span',
    className: 'header',
    text: i18n(category),
    appendTo: categoryEl
  })

  optionsContainers[category] = element({
    tagName: 'ul',
    appendTo: categoryEl
  })

})

const getTitle = (num, unit) => {
  if (num === 1) {
    unit = unit.replace(/s$/, '')
  }
  return i18n('browse_every_time_unit', [num.toString(), i18n(unit)])
}

categoriesList.forEach((category) => {
  let { daysFactor, letter, options:optionsNums } = options[category]
  for (let num of optionsNums) {
    let frequency = `${num}${letter}`
    element({
      tagName: 'li',
      className: `option frequency-${frequency}`,
      text: num,
      attributes: {
        'data-frequency': frequency,
        title: getTitle(num, category)
      },
      appendTo: optionsContainers[category],
      // use delegated events to set only 1 event listner instead of 30
      onClick: actions.select
    })
  }
})

const removeEl = element({
  tagName: 'div',
  className: 'remove',
  text: i18n('remove'),
  appendTo: containerEl
})

const settingsEl = element({
  tagName: 'div',
  className: 'settings',
  text: i18n('settings'),
  appendTo: containerEl
})

removeEl.addEventListener('click', actions.remove)

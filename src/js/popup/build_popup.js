const i18n = chrome.i18n.getMessage.bind(chrome.i18n)
const buildElement = require('../lib/element')
const options = require('./options')
const _ = require('../lib/utils')
const actions = require('./actions')
const getColor = require('./colors')
const bookmarks = require('../lib/bookmarks')

const containerEl = document.querySelector('.container')

// build span.browse-every
buildElement({
  tagName: 'h2',
  className: 'browse-every',
  text: i18n('browse_every'),
  appendTo: containerEl
})

// build every div#${category} and their children
// - span.header
// - ul
//   - li.option + click event listener
const optionsContainers = {}
const categoriesList = Object.keys(options)

categoriesList.forEach((category) => {
  let categoryEl = buildElement({
    tagName: 'div',
    id: category,
    className: 'category',
    appendTo: containerEl
  })

  buildElement({
    tagName: 'span',
    className: 'header',
    text: i18n(category),
    appendTo: categoryEl
  })

  optionsContainers[category] = buildElement({
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
    let backgroundColor = getColor(num, daysFactor)
    let data = {
      tagName: 'li',
      className: `option frequency-${frequency}`,
      text: num,
      attributes: {
        'data-frequency': frequency,
        title: getTitle(num, category)
      },
      style: {
        backgroundColor: backgroundColor
      },
      appendTo: optionsContainers[category],
      // TODO: use delegated events to set only 1 event listner instead of 30
      onClick: actions.select
    }
    // Adjusting thresold darkest color to match "1 year"
    // and have the full years line in the same color
    if (backgroundColor <= '#494949') {
      data.style.color = 'white'
    }
    buildElement(data)
  }
})

// build div.remove  + click event listener
const removeEl = buildElement({
  tagName: 'div',
  className: 'remove',
  text: i18n('remove'),
  appendTo: containerEl
})

removeEl.addEventListener('click', actions.remove)

// build div.settings
const settingsEl = buildElement({
  tagName: 'div',
  className: 'settings',
  text: i18n('settings'),
  appendTo: containerEl
})

const nextVisitHeaderEl = document.querySelector('#nextVisitHeader')
const nextVisitEl = document.querySelector('#nextVisit')

function updateNextVisit (date) {
  nextVisitHeaderEl.textContent = i18n('next_visit')
  nextVisitEl.textContent = date.toLocaleString()
}

function highlightCurrentFrequency (frequency) {
  const currentFrequencyEl = document.querySelector(`.frequency-${frequency}`)
  currentFrequencyEl.className = currentFrequencyEl.className + ' selected'
}

module.exports = function buildPopup (bookmarkData) {
  if (bookmarks.isInFolder(bookmarkData)) {
    const titleData = bookmarks.title.parse(bookmarkData.title)
    console.log('titleData', titleData)
    if (titleData) {
      updateNextVisit(titleData.nextVisit)
      highlightCurrentFrequency(titleData.frequency)
    }
  }
}
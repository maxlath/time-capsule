const i18n = require('../lib/i18n')
const buildElement = require('../lib/element')
const options = require('./options')
const actions = require('./actions')
const getColor = require('./colors')
const periodicityOptionsEl = document.querySelector('#periodicityOptions')

// build span.browse-every
buildElement({
  tagName: 'h2',
  className: 'browse-every',
  text: i18n('browse_every'),
  appendTo: periodicityOptionsEl
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
    appendTo: periodicityOptionsEl
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

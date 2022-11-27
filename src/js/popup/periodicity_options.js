const i18n = require('../lib/i18n')
const buildElement = require('../lib/element')
const { inMenu: options } = require('./options')
const actions = require('./actions')
const getColor = require('./colors')
const periodicityOptionsEl = document.querySelector('#periodicityOptions')
const { matrix } = require('./matrix')

// build span.browse-every
buildElement({
  tagName: 'h2',
  className: 'browse-every',
  text: i18n('browse_every'),
  appendTo: periodicityOptionsEl
})

// build every div#${category} and their children
// - h3.category-header
// - ul
//   - li.option + click event listener
const optionsContainers = {}
const categoriesList = Object.keys(options)

categoriesList.forEach(category => {
  const categoryEl = buildElement({
    tagName: 'div',
    id: category,
    className: 'category',
    appendTo: periodicityOptionsEl
  })

  buildElement({
    tagName: 'h3',
    className: 'category-header',
    text: i18n(category),
    appendTo: categoryEl
  })

  optionsContainers[category] = buildElement({
    tagName: 'ul',
    appendTo: categoryEl
  })
})

const getTitle = (frequency, num, unit) => {
  if (num === 1) unit = unit.replace(/s$/, '')
  const hotkey = ` [${frequency}]`
  return i18n('browse_every_time_unit', [ num.toString(), i18n(unit) ]) + hotkey
}

categoriesList.forEach(category => {
  const { daysFactor, letter, options: optionsNums } = options[category]
  const categoryMatrix = []
  const rowNum = matrix.push(categoryMatrix) - 1
  for (const num of optionsNums) {
    const frequency = `${num}${letter}`
    const backgroundColor = getColor(num, daysFactor)
    const data = {
      tagName: 'li',
      className: `option frequency-${frequency}`,
      text: num,
      attributes: {
        'data-frequency': frequency,
        title: getTitle(frequency, num, category)
      },
      style: { backgroundColor },
      appendTo: optionsContainers[category],
      // TODO: use delegated events to set only 1 event listner instead of 30
      onClick: actions.select
    }
    // Adjusting thresold darkest color to match "1 year"
    // and have the full years line in the same color
    if (backgroundColor <= '#494949') data.style.color = 'white'
    const optionEl = buildElement(data)
    optionEl.place = {
      row: rowNum,
      column: categoryMatrix.push(optionEl) - 1
    }
  }
})

module.exports = periodicityOptionsEl

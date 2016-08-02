const i18n = require('../lib/i18n')
const buildElement = require('../lib/element')
const helpEl = document.querySelector('#help')
const options = require('./options')

function buildHelpElements (optionsObj) {
  for (let optionName in optionsObj) {
    let option = optionsObj[optionName]
    let el = buildElement({
      tagName: 'li',
      className: 'option-help',
      appendTo: helpEl
    })
    buildElement({
      tagName: 'span',
      className: 'option-letter',
      text: option.letter,
      appendTo: el
    })
    buildElement({
      tagName: 'span',
      className: 'option-name',
      text: i18n(optionName),
      appendTo: el
    })
  }
}

buildHelpElements(options.typingOnly)
buildHelpElements(options.inMenu)

module.exports = helpEl

const optionsViewEl = document.querySelector('#optionsView')
const typingViewEl = document.querySelector('#typingView')
const typingEl = document.querySelector('#typing')
const helpEl = require('./build_help')
const lastKeys = require('./last_keys')

var lastViewWasOptions = true

module.exports = {
  showFrequencyTypingView: () => {
    hide(optionsViewEl)
    show(typingViewEl)
    typingEl.textContent = lastKeys.getMatchingPart()
    lastViewWasOptions = false
  },
  showFrequencyOptionsView: () => {
    hide(typingViewEl)
    show(optionsViewEl)
    typingEl.textContent = ''
    lastViewWasOptions = true
  },
  showFrequencySelectionSuccess: frequency => {
    // helpEl shouldn't be hidden when the last view was the typing view
    // as it makes the text jump
    if (lastViewWasOptions) hide(helpEl)
    hide(optionsViewEl)
    show(typingViewEl)
    typingEl.textContent = frequency
    typingEl.classList.add('success')
  }
}

const show = el => { el.style.display = 'block' }
const hide = el => { el.style.display = 'none' }

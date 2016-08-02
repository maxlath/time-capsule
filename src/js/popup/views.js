const optionsViewEl = document.querySelector('#optionsView')
const typingViewEl = document.querySelector('#typingView')
const typingEl = document.querySelector('#typing')

module.exports = {
  showFrequencyTypingView: (key) => {
    hide(optionsViewEl)
    show(typingViewEl)
    typingEl.textContent = typingEl.textContent.slice(-3) + key

  },
  showFrequencyOptionsView: () => {
    hide(typingViewEl)
    show(optionsViewEl)
    typingEl.textContent = ''
  }
}

const show = (el) => el.style.display = 'block'
const hide = (el) => el.style.display = 'none'

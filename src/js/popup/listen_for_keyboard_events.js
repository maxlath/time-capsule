const matrix = require('./matrix')
const actions = require('./actions')
const lastKeys = require('./last_keys')
const views = require('./views')
const parseKey = require('./parse_key')
const _ = require('../lib/utils')

// can't use the event object as it's the whole popup body that gets the event
const select = () => matrix.findSelected().click()

const API = {
  ArrowUp: matrix.up,
  ArrowDown: matrix.down,
  ArrowLeft: matrix.left,
  ArrowRight: matrix.right,
  Enter: select,
  Delete: actions.remove
}

var lastKeyWasFloat = false

function keydownListener (e) {
  const key = parseKey(e)
  let isFloatCharacter = /^[\d.]{1}$/.test(key)

  if (_.has(ignoreKey, key)) return

  const foundFrequency = lastKeys.matchFrequencyPattern(key)

  // 'Backspace' was taken in account by lastKeys.matchFrequencyPattern
  if (key === 'Backspace') {
    // mimicking the last key to trigger the same view
    if (lastKeyWasFloat) {
      isFloatCharacter = true
    } else {
      isFloatCharacter = false
    }
  }

  if (foundFrequency) {
    actions.setFrequency(foundFrequency)
    return
  }

  if (isFloatCharacter) {
    views.showFrequencyTypingView()
    lastKeyWasFloat = true
  } else {
    views.showFrequencyOptionsView()
    lastKeyWasFloat = false
    const action = API[key]
    if (action) {
      action(e)
    }
  }
}

const ignoreKey = ['Shift']

module.exports = function listenForKeyboardEvents () {
  window.addEventListener('keydown', keydownListener)
}

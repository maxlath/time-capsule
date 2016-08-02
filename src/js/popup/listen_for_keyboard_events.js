const matrix = require('./matrix')
const actions = require('./actions')
const lastKeys = require('./last_keys')
const views = require('./views')
const solveKeyAliases = require('./solve_key_aliases')
const _ = require('../lib/utils')

// can't use the event object as it's the whole popup body that gets the event
const select = () => matrix.findSelected().click()

const API = {
  ArrowUp: matrix.up,
  ArrowDown: matrix.down,
  ArrowLeft: matrix.left,
  ArrowRight: matrix.right,
  Enter: select,
  Delete: actions.remove
}

function keydownListener (e) {
  let { key } = e
  key = solveKeyAliases(key)

  if (_.has(ignoreKey, key)) return

  const foundFrequency = lastKeys.matchFrequencyPattern(key)
  if (foundFrequency) {
    actions.setFrequency(foundFrequency)
    return
  }

  if (isNumber(key)) {
    views.showFrequencyTypingView(key)
  } else {
    views.showFrequencyOptionsView()
    const action = API[key]
    if (action) {
      action(e)
    }
  }
}

// include dots for floats
const isNumber = (key) => /^[\d\.]{1}$/.test(key)

const ignoreKey = ['Shift']

module.exports = function listenForKeyboardEvents () {
  window.addEventListener('keydown', keydownListener)
}

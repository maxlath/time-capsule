const matrix = require('./matrix')
const actions = require('./actions')
const lastKeys = require('./last_keys')

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
  const { key } = e

  const foundFrequency = lastKeys.matchFrequencyPattern(key)
  if (foundFrequency) {
    console.log('frequency found', foundFrequency)
    actions.setFrequency(foundFrequency)
  }

  const action = API[key]
  if (action) {
    action(e)
  }
}

module.exports = function listenForKeyboardEvents () {
  window.addEventListener('keydown', keydownListener)
}

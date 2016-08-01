const matrix = require('./matrix')
const actions = require('./actions')

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

module.exports = function listenForKeyboardEvents () {
  window.addEventListener('keydown', (e) => {
    const action = API[e.key]
    if (action) {
      action(e)
    }
  })
}

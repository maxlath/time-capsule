const matrix = require('./matrix')

const API = {
  ArrowUp: matrix.up,
  ArrowDown: matrix.down,
  ArrowLeft: matrix.left,
  ArrowRight: matrix.right,
  Enter: select
}

function select (e) {
  // can't use the event object as it's the whole popup body that gets the event
  matrix.findSelected().click()
}


module.exports = function listenForKeyboardEvents () {
  window.addEventListener('keydown', (e) => {
    const action = API[e.key]
    if (action) {
      action(e)
    }
  })
}

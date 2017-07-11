const views = require('./views')

module.exports = frequency => () => {
  return new Promise((resolve, reject) => {
    views.showFrequencySelectionSuccess(frequency)
    // Let the time for the animation, minus 200 millisecondes to let
    // window.close close the popup will the animation is till ongoing
    setTimeout(resolve, 300)
  })
}

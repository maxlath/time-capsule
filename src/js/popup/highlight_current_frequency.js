module.exports = function highlightCurrentFrequency (frequency) {
  const currentFrequencyEl = document.querySelector(`.frequency-${frequency}`)
  currentFrequencyEl.className = currentFrequencyEl.className + ' selected'
}
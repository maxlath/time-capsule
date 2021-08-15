// leading figure can't be 0
const pattern = /^[^\d.]?([1-9][\d.]{0,2})([HDWMYT])$/i

let lastKeys = ''

module.exports = {
  matchFrequencyPattern: key => {
    if (key === 'Backspace') {
      lastKeys = lastKeys.slice(0, -1)
      return
    }
    // Keep only the last 4 keys
    lastKeys = lastKeys.slice(-3) + key
    const match = lastKeys.match(pattern)
    if (match) {
      let [ matching, num, unit ] = match  // eslint-disable-line
      // prevent to pass sequences like 000
      num = parseFloat(num).toString()
      unit = unit.toUpperCase()
      return `${num}${unit}`
    }
  },
  getMatchingPart: () => {
    return lastKeys
    // removing all non-float characters
    .replace(/^.*[^\d.]+/, '')
    // don't take more than 3 float characters as the 4th character will be the unit
    .slice(-3)
  }
}

const pattern = /^[^\d]*(\d[\d\.]{1,2}[HDWMYT])$/i

var lastKeys = ''

module.exports = {
  matchFrequencyPattern: (key) => {
    if (key === 'Backspace') {
      lastKeys = lastKeys.slice(0, -1)
      return
    }
    // Keep only the last 4 keys
    lastKeys = lastKeys.slice(-3) + key
    console.log('lastKeys', lastKeys)
    const match = lastKeys.match(pattern)
    // if match exist, return the part between parenthesis = the frequency
    return match && match[1]
  },
  getMatchingPart: () => {
    return lastKeys
    // removing all non-float characters
    .replace(/^.*[^\d\.]+/, '')
    // don't take more than 3 float characters as the 4th character will be the unit
    .slice(-3)
  }
}

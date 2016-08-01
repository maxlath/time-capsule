const pattern = /^[^\d]*(\d[\d\.]{1,2}[HDWMYT])$/i

var lastKeys = ''

module.exports = {
  matchFrequencyPattern: (key) => {
    key = solveAliases(key)
    // Keep only the last 4 keys
    lastKeys = lastKeys.slice(-3) + key
    console.log('lastKeys', lastKeys)
    const match = lastKeys.match(pattern)
    // if match exist, return the part between parenthesis = the frequency
    return match && match[1]
  }
}

const aliases = {
  ',': '.'
}

const solveAliases = (key) => aliases[key] || key

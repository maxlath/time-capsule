const keyAliases = {
  ',': '.'
}

// allow to type a figure without using Shift on a French keyboard
const whichAliases = {
  49: '1',
  50: '2',
  51: '3',
  52: '4',
  53: '5',
  54: '6',
  55: '7',
  56: '8',
  57: '9',
  48: '0'
}

module.exports = (e) => keyAliases[e.key] || whichAliases[e.which] || e.key

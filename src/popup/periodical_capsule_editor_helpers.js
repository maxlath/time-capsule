// leading figure can't be 0
const frequencyPattern = /^[^\d.]?([1-9][\d.]{0,2})([HDWMYT])$/i
const frequencyStartPattern = /([1-9][\d.]{0,2})([HDWMYT])?$/i

export function findFrequencyPattern (lastKeys) {
  const match = lastKeys.match(frequencyPattern)
  if (match) {
    let [ , num, unit ] = match
    // prevent to pass sequences like 000
    num = parseFloat(num).toString()
    unit = unit.toUpperCase()
    return `${num}${unit}`
  }
}

export function getMatchingPart (str) {
  const match = str.match(frequencyStartPattern)
  return match ? match[0] : ''
}

export const isKeyboardSelectorKey = key => /^[\d.HDWMYT]{1}$/i.test(key)

import { unitsLabels, incrementByTimeUnit } from './times.js'

const separator = ' /ᐒ/ '
const pattern = /\s\/ᐒ\/\s([\d.]{1,3})([HDWMYT])\s(.*)$/

export const formatBookmarkTitle = (title, frequency, updating) => {
  // Use ISOString as it's nicer for readability
  const nextVisit = getNextVisit(frequency)
  // cleaning old data
  if (updating) {
    title = title.replace(pattern, '')
  }
  return `${title}${separator}${frequency} ${nextVisit}`
}

export const getNextVisit = frequency => {
  const num = parseInt(frequency.slice(0, -1))
  const unit = frequency.slice(-1)
  return incrementByTimeUnit[unit](Date.now(), num).toISOString()
}

export const parseBookmarkTitle = title => {
  const match = title.match(pattern)
  if (match) {
    const [ , num, unit, nextVisit ] = match
    return {
      cleanedTitle: title.split(separator)[0],
      frequency: `${num}${unit}`,
      frequencyLabel: `${num} ${unitsLabels[unit]}`,
      // epoch time number should take less memory and computation power
      // than an ISO time string in the bookmark index
      nextVisit: new Date(nextVisit).getTime()
    }
  }
}

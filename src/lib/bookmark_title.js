import { unitsLabels, incrementByTimeUnit, timeIsInThePast } from './times.js'

const separator = ' /ᐒ/ '
const pattern = /\s\/ᐒ\/\s([\d.]{1,3})([HDWMYT])\s(.*)$/

export const formatBookmarkTitle = ({ title, frequency, referenceDate, updating }) => {
  const nextVisit = getNextVisit({ frequency, referenceDate })
  // cleaning old data
  if (updating) {
    title = title.replace(pattern, '')
  }
  const timestamps = `ref=${new Date(referenceDate).toISOString()} next=${new Date(nextVisit).toISOString()}`
  return `${title}${separator}${frequency} ${timestamps}`
}

export const getNextVisit = ({ frequency, referenceDate }) => {
  const num = parseInt(frequency.slice(0, -1))
  const unit = frequency.slice(-1)
  let nextVisit = incrementByTimeUnit[unit](referenceDate, num)
  // TODO: For inner-day frequencies (minutes, hours), it could be more efficient
  // to replace the referenceDate day by today, then iterate,
  // to skip the potentially numerous iterations
  while (timeIsInThePast(nextVisit)) {
    nextVisit = incrementByTimeUnit[unit](nextVisit, num)
  }
  return nextVisit
}

export const parseBookmarkTitle = title => {
  const match = title.match(pattern)
  if (match) {
    const [ , num, unit, timestamps ] = match
    let referenceDate, nextVisit
    if (timestamps.startsWith('ref')) {
      const timestampsData = timestamps.split(' ').reduce(parseTimestamps, {})
      ;({ ref: referenceDate, next: nextVisit } = timestampsData)
    } else {
      // Legacy format
      referenceDate = nextVisit = timestamps
    }
    return {
      cleanedTitle: title.split(separator)[0],
      frequency: `${num}${unit}`,
      frequencyLabel: `${num} ${unitsLabels[unit]}`,
      // epoch time number should take less memory and computation power
      // than an ISO time string in the bookmark index
      nextVisit: new Date(nextVisit).getTime(),
      referenceDate: new Date(referenceDate).getTime(),
    }
  }
}

function parseTimestamps (obj, part) {
  const [ key, value ] = part.split('=')
  obj[key] = value
  return obj
}

import { unitsLabels, incrementByTimeUnit, timeIsInThePast } from './times.js'
import { parseFrequency } from './utils.js'

const separator = ' /ᐒ/ '
const pattern = /\s\/ᐒ\/\s([\d.]{1,3})([HDWMYT])\s(.*)$/

export const formatBookmarkTitle = ({ title, frequency, nextVisit, referenceDate, repeat, updating }) => {
  nextVisit = nextVisit || getNextVisit({ frequency, referenceDate })
  // cleaning old data
  if (updating) {
    title = title.replace(pattern, '')
  }
  let metadata = `ref=${new Date(referenceDate).toISOString()} next=${new Date(nextVisit).toISOString()}`
  if (repeat) metadata += ` repeat=${repeat}`
  return `${title}${separator}${frequency} ${metadata}`
}

export const getNextVisit = ({ frequency, referenceDate }) => {
  const { num, unit } = parseFrequency(frequency)
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
    const [ , num, unit, metadata ] = match
    let referenceDate, nextVisit, repeat
    if (metadata.startsWith('ref')) {
      const parsedMetadata = metadata.split(' ').reduce(parseMetadata, {})
      ;({ ref: referenceDate, next: nextVisit, repeat } = parsedMetadata)
      if (/^\d+$/.test(repeat)) repeat = parseInt(repeat)
    } else {
      // Legacy format
      referenceDate = nextVisit = metadata
    }
    return {
      cleanedTitle: title.split(separator)[0],
      frequency: `${num}${unit}`,
      frequencyLabel: `${num} ${unitsLabels[unit]}`,
      // epoch time number should take less memory and computation power
      // than an ISO time string in the bookmark index
      nextVisit: new Date(nextVisit).getTime(),
      referenceDate: new Date(referenceDate).getTime(),
      repeat,
    }
  }
}

function parseMetadata (obj, part) {
  const [ key, value ] = part.split('=')
  obj[key] = value
  return obj
}

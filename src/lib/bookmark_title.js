import { incrementByTimeUnit, timeIsInThePast } from './times.js'
import { isPositiveIntegerString } from './utils.js'
import { parseFrequency } from './frequency.js'

const separator = ' /ᐒ/ '
const pattern = /\s\/ᐒ\/\s(.*)$/

export const formatBookmarkTitle = ({ title, frequency, nextVisit, referenceDate, repeat, updating }) => {
  nextVisit = nextVisit || getNextVisit({ frequency, referenceDate })
  // cleaning old data
  if (updating) {
    title = title.replace(pattern, '')
  }
  let metadata = ''
  if (frequency != null) metadata += `freq=${frequency} `
  metadata += `ref=${new Date(referenceDate).toISOString()} next=${new Date(nextVisit).toISOString()}`
  if (repeat != null) metadata += ` repeat=${repeat}`
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
    let [ , metadata ] = match
    let frequency, referenceDate, nextVisit, repeat
    if (metadata.includes('=')) {
      const parsedMetadata = metadata.split(' ').reduce(parseMetadata, {})
      ;({ freq: frequency, ref: referenceDate, next: nextVisit, repeat } = parsedMetadata)
      if (isPositiveIntegerString(repeat)) repeat = parseInt(repeat)
    } else {
      // Legacy format
      [ frequency, metadata ] = metadata.split(' ')
      referenceDate = nextVisit = metadata
    }
    const { num, unit, unitLabel } = parseFrequency(frequency)
    return {
      cleanedTitle: title.split(separator)[0],
      frequency: `${num}${unit}`,
      frequencyLabel: `${num} ${unitLabel}`,
      // epoch time number should take less memory and computation power
      // than an ISO time string in the bookmark index
      nextVisit: new Date(nextVisit).getTime(),
      referenceDate: new Date(referenceDate).getTime(),
      repeat: repeat != null ? repeat : null,
    }
  }
}

function parseMetadata (obj, part) {
  const [ key, value ] = part.split('=')
  obj[key] = value
  return obj
}

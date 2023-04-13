import { incrementByTimeUnit, regularTimeUnits, timeUnits, toMs } from './times.js'
import { isPositiveIntegerString } from './utils.js'
import { parseFrequency } from './frequency.js'

const separator = ' /ᐒ/ '
const pattern = /\s\/ᐒ\/\s(.*)$/

export const formatBookmarkTitle = ({ title, frequency, nextVisit, referenceDate, repeat, updating, noRegrouping }) => {
  nextVisit = nextVisit || getNextVisit({ frequency, referenceDate })
  // cleaning old data
  if (updating) {
    title = title.replace(pattern, '')
  }
  let metadata = ''
  if (frequency) metadata += `freq=${frequency} `
  if (referenceDate) metadata += `ref=${new Date(referenceDate).toISOString()} `
  metadata += `next=${new Date(nextVisit).toISOString()} `
  if (repeat != null) metadata += `repeat=${repeat} `
  if (noRegrouping) metadata += `nrg=1 `
  return `${title}${separator}${metadata}`.trim()
}

export const getNextVisit = ({ frequency, referenceDate }) => {
  const { num, unit } = parseFrequency(frequency)
  const now = Date.now()
  referenceDate = referenceDate || now
  let nextVisit = referenceDate
  if (regularTimeUnits.has(unit)) {
    nextVisit = getQuickLastVisitTime({ referenceDate, num, unit })
  }
  // Add 1s margin to avoid giving a next visit date that would be just now. Mostly useful for tests.
  while ((now + 1000) > toMs(nextVisit)) {
    nextVisit = incrementByTimeUnit[unit](nextVisit, num)
  }
  return nextVisit
}

const getQuickLastVisitTime = ({ referenceDate, num, unit }) => {
  const referenceDateMs = new Date(referenceDate).getTime()
  const timeSinceReferenceDate = Date.now() - referenceDateMs
  const frequencyPeriods = Math.trunc(timeSinceReferenceDate / (num * timeUnits[unit]))
  return referenceDateMs + frequencyPeriods * num * timeUnits[unit]
}

export const parseBookmarkTitle = title => {
  const match = title.match(pattern)
  if (match) {
    let [ , metadata ] = match
    let frequency, referenceDate, nextVisit, repeat, noRegrouping
    if (metadata.includes('=')) {
      const parsedMetadata = metadata.split(' ').reduce(parseMetadata, {})
      ;({ freq: frequency, ref: referenceDate, next: nextVisit, repeat } = parsedMetadata)
      if (isPositiveIntegerString(repeat)) repeat = parseInt(repeat)
      noRegrouping = parsedMetadata.nrg === '1'
    } else {
      // Legacy format
      [ frequency, metadata ] = metadata.split(' ')
      referenceDate = nextVisit = metadata
    }
    const capsuleData = {
      cleanedTitle: title.split(separator)[0],
      // epoch time number should take less memory and computation power
      // than an ISO time string in the bookmark index
      nextVisit: new Date(nextVisit).getTime(),
      repeat: repeat != null ? repeat : null,
      noRegrouping,
    }
    if (frequency) {
      const { frequencyLabel } = parseFrequency(frequency)
      capsuleData.frequency = frequency
      capsuleData.frequencyLabel = frequencyLabel
    }
    if (referenceDate) {
      capsuleData.referenceDate = new Date(referenceDate).getTime()
    }
    return capsuleData
  }
}

function parseMetadata (obj, part) {
  const [ key, value ] = part.split('=')
  obj[key] = value
  return obj
}

export const serializeBookmark = bookmark => {
  const data = parseBookmarkTitle(bookmark.title) || {}
  return Object.assign(data, bookmark)
}

const _ = require('../lib/utils')
const times = require('./times')
const separator = ' // '
const pattern = /\s\/\/\s(\d{1,2})([HDWMY])\s(.*)$/

function format (title, frequency, updating) {
  // Use ISOString as it's nicer for readability
  const nextVisit = getNextVisit(frequency)
  // cleaning old data
  if (updating) {
    title = title.replace(pattern, '')
  }
  return `${title}${separator}${frequency} ${nextVisit}`
}

function getNextVisit (frequency) {
  const num = parseInt(frequency.slice(0, -1))
  const unit = frequency.slice(-1)
  const time = _.now() + num*times[unit]
  return new Date(time).toISOString()
}

function parse (title) {
  const match = title.match(pattern)
  if (match) {
    const [matching, num, unit, nextVisit] = match
    return {
      frequency: `${num}${unit}`,
      // epoch time number should take less memory and computation power
      // than an ISO time string in the bookmark index
      nextVisit: new Date(nextVisit).getTime()
    }
  }
}

module.exports = {
  format: format,
  parse: parse
}
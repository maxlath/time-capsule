const _ = require('../lib/utils')
const times = require('./times')
const separator = ' /ᐒ/ '
const pattern = /\s\/ᐒ\/\s([\d.]{1,3})([HDWMYT])\s(.*)$/
const halfAMinute = times.T / 2

const format = (title, frequency, updating) => {
  // Use ISOString as it's nicer for readability
  const nextVisit = getNextVisit(frequency)
  // cleaning old data
  if (updating) {
    title = title.replace(pattern, '')
  }
  return `${title}${separator}${frequency} ${nextVisit}`
}

const getNextVisit = frequency => {
  // accepting floats
  const num = parseFloat(frequency.slice(0, -1))
  const unit = frequency.slice(-1)
  let delay = num * times[unit]
  // Prevent scheduling a tab in less than 30 secondes
  // as a very short delay could mean 🔥 BROWSER TABS INFINITE LOOP HELL 🔥
  if (delay < halfAMinute) {
    delay = halfAMinute
  }
  const time = _.now() + delay
  return new Date(time).toISOString()
}

const parse = title => {
  const match = title.match(pattern)
  if (match) {
    const [ matching, num, unit, nextVisit ] = match // eslint-disable-line
    return {
      frequency: `${num}${unit}`,
      // epoch time number should take less memory and computation power
      // than an ISO time string in the bookmark index
      nextVisit: new Date(nextVisit).getTime()
    }
  }
}

module.exports = { format, parse }

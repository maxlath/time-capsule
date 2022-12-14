export const minute = 60 * 1000
export const hour = 60 * minute
export const day = 24 * hour
export const week = 7 * day
export const year = 365.25 * day
export const month = year / 12

export const H = hour
export const D = day
export const W = week
export const M = month
export const Y = year
export const T = minute

export const timeUnits = { H, D, W, M, Y, T }

export const unitsLabels = {
  T: 'minute(s)',
  H: 'hour(s)',
  D: 'day(s)',
  W: 'week(s)',
  M: 'month(s)',
  Y: 'year(s)',
}

export const getMinutes = time => new Date(time).getMinutes()
export const getHours = time => new Date(time).getHours()
export const getDay = time => new Date(time).getDate()
export const getMonth = time => new Date(time).getMonth()
export const getYear = time => new Date(time).getFullYear()

const getTimeUnitValue = {
  T: getMinutes,
  H: getHours,
  D: getDay,
  M: getMonth,
  Y: getYear,
}

const setTimeUnit = setFn => (time, num) => {
  const date = new Date(time)
  date[setFn](num)
  return date
}

export const setMinutes = setTimeUnit('setMinutes')
export const setHours = setTimeUnit('setHours')
export const setDay = setTimeUnit('setDate')
export const setMonth = setTimeUnit('setMonth')
export const setYear = setTimeUnit('setFullYear')

const setTimeUnitValue = {
  T: setMinutes,
  H: setHours,
  D: setDay,
  M: setMonth,
  Y: setYear,
}

const incrementTimeUnitValue = unit => (time, num) => {
  const timeUnitValue = getTimeUnitValue[unit](time)
  return setTimeUnitValue[unit](time, timeUnitValue + num)
}

export const incrementByTimeUnit = {
  T: incrementTimeUnitValue('T'),
  H: incrementTimeUnitValue('H'),
  D: incrementTimeUnitValue('D'),
  W: (time, num) => {
    const days = getDay(time)
    return setDay(time, days + 7 * num)
  },
  M: incrementTimeUnitValue('M'),
  Y: incrementTimeUnitValue('Y'),
}

export function timeIsInThePast (time) {
  return new Date(time).getTime() < Date.now()
}

export function getDateTimeLocalInputValue (date) {
  if (date) {
    date = new Date(date)
  } else {
    date = new Date()
  }
  const localYear = date.getFullYear().toString().padStart(4, '0')
  const localMonth = (date.getMonth() + 1).toString().padStart(2, '0')
  const localDay = date.getDate().toString().padStart(2, '0')
  const localTime = date.toTimeString().split(':').slice(0, 2).join(':')
  return `${localYear}-${localMonth}-${localDay}T${localTime}`
}

export const toIso = time => new Date(time).toISOString()

export function getNextVisitSummary (date) {
  date = new Date(date)
  const timeFromNow = date.getTime() - Date.now()
  if (timeFromNow > 2 * year) {
    const yearsFromNow = Math.round(timeFromNow / year)
    return `${yearsFromNow}Y`
  } else if (timeFromNow > 3 * month) {
    const monthsFromNow = Math.round(timeFromNow / month)
    return `${monthsFromNow}M`
  } else if (timeFromNow > 3 * week) {
    const weeksFromNow = Math.round(timeFromNow / week)
    return `${weeksFromNow}W`
  } else if (timeFromNow > 3 * day) {
    const daysFromNow = Math.round(timeFromNow / day)
    return `${daysFromNow}D`
  } else if (timeFromNow > 1 * hour) {
    const hoursFromNow = Math.round(timeFromNow / hour)
    return `${hoursFromNow}H`
  } else {
    return ''
  }
}

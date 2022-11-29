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

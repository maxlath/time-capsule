const minute = 60 * 1000
const hour = 60 * minute
const day = 24 * hour
const week = 7 * day
const year = 365.25 * day
const month = year / 12

export const H = hour
export const D = day
export const W = week
export const M = month
export const Y = year
export const T = minute

export const timeUnits = { H, D, W, M, Y, T }

export function epochToSimpleTime (epoch) {
  return new Date(epoch)
    .toISOString()
    .split('.')[0]
    .replace('T', ' ')
}

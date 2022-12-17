import { formatLocalTime } from '../lib/times.js'
import { range } from '../lib/utils.js'

export const days = [ 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun' ]
export const slotsPerHour = 1
export const slots = range(0, 24 * slotsPerHour - 1)
export const slotMinutes = 60 / slotsPerHour

export function initWeekTimes (weekTimes) {
  weekTimes = weekTimes || {}
  for (const day of days) {
    weekTimes[day] = weekTimes[day] || {}
  }
  return weekTimes
}

export const slotIndexAsHour = i => {
  const hour = Math.trunc(i / slotsPerHour)
  const minutes = (i % slotsPerHour) * slotMinutes
  const time = `${padTimePart(hour)}:${padTimePart(minutes)}`
  return formatLocalTime(time)
}

const padTimePart = num => num.toString().padStart(2, '0')

export const slotIndexAsHourRange = i => `${slotIndexAsHour(i)}-${slotIndexAsHour(i + 1)}`

export function updateHighlighted ({ startingCell, mouseoverCell }) {
  const highlighted = {}
  initWeekTimes(highlighted)
  const dayRange = [
    days.indexOf(startingCell.day),
    days.indexOf(mouseoverCell.day),
  ].sort(increasingly)
  const rangeDays = days.slice(dayRange[0], dayRange[1] + 1)
  const slotsRange = [ parseInt(startingCell.slot), parseInt(mouseoverCell.slot) ].sort(increasingly)
  const rangeSlots = slots.slice(slotsRange[0], slotsRange[1] + 1)
  for (const day of rangeDays) {
    for (const slot of rangeSlots) {
      highlighted[day][slot] = true
    }
  }
  return highlighted
}

const increasingly = (a, b) => a - b

export function toggleHighlighted ({ blockedWeekTimes, highlighted, select }) {
  for (const day of days) {
    for (const slot of slots) {
      if (highlighted[day][slot]) blockedWeekTimes[day][slot] = select
    }
  }
  return blockedWeekTimes
}

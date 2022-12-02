import { unitsLabels } from './times.js'

export function parseFrequency (frequency) {
  if (frequency === 'never') return {}
  const num = parseInt(frequency.slice(0, -1))
  const unit = frequency.slice(-1)
  let unitLabel
  if (num === 1) {
    unitLabel = unitsLabels[unit].replace('(s)', '')
  } else if (num != null) {
    unitLabel = unitsLabels[unit].replace(/[()]/g, '')
  }
  return { num, unit, unitLabel }
}

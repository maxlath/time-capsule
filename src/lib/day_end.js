import { D as oneDay } from '../lib/times'

let dayEnd

export const get = () => dayEnd

export const set = () => {
  dayEnd = Date.now() + oneDay
}

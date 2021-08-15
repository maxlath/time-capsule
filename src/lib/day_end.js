import { now } from '../lib/utils'
import { D as oneDay } from '../lib/times'

let dayEnd

export function get () { return dayEnd }
export function set () { dayEnd = now() + oneDay }

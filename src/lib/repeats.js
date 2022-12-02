import { range } from './utils.js'

export const repeatsOptions = [ '∞' ].concat(range(0, 10))

export const repeatsOptionsLegends = {
  '∞': 'Keep re-opening a capsule until the End of Times',
  '0': 'automatically delete a capsule',
}

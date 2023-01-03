export const log = (obj, label) => {
  console.log(label, obj)
  return obj
}

export const Log = label => obj => log(obj, label)

export const Error = label => err => console.error(label, err)

export const ErrorRethrow = label => {
  return err => {
    console.error(label, err)
    throw err
  }
}

export const first = array => array[0]

export const has = (array, value) => array.indexOf(value) > -1

export const sleep = (ms = 0) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function range (from, to) {
  return Array.from(Array(to + 1).keys()).slice(from)
}

export const isPositiveIntegerString = str => /^\d+$/.test(str)

export const partition = (collection, splitFn) => {
  const a = []
  const b = []
  for (const obj of collection) {
    if (splitFn(obj)) {
      a.push(obj)
    } else {
      b.push(obj)
    }
  }
  return [ a, b ]
}

// Filter-out URLs such as (about|chrome|file|data):*
// See https://bugzilla.mozilla.org/show_bug.cgi?id=1352835
export const isCapsulableUrl = url => url?.startsWith('http')

export function usesDarkMode () {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
}

export const repeatNum = repeat => {
  if (typeof repeat === 'number') return repeat
  if (repeat === '∞') return Infinity
  if (typeof repeat === 'string') return parseInt(repeat)
  return 0
}

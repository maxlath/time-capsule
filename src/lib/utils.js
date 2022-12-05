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

export function usesDarkMode () {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
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

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

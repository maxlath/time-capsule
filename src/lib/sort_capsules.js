import { timeUnits } from './times.js'

export const getFrequencyTime = frequency => {
  const number = parseInt(frequency.slice(0, -1))
  const letter = frequency.at(-1)
  const total = number * timeUnits[letter]
  return total
}

const sortByFrequency = (a, b) => getFrequencyTime(a.frequency) - getFrequencyTime(b.frequency)

const sortByDate = sortField => (a, b) => a[sortField] - b[sortField]

const sortByTitle = (a, b) => a.title > b.title ? 1 : -1

export const sortFunctions = {
  title: sortByTitle,
  frequency: sortByFrequency,
  nextVisit: sortByDate('nextVisit'),
  dateAdded: sortByDate('dateAdded'),
}

import { parseFrequency } from '../lib/frequency.js'
import { getColor } from './colors.js'

export const categoriesInMenu = {
  hours: {
    letter: 'H',
    options: [ 1, 2, 3, 6, 12, 18 ],
    daysFactor: 1 / 24
  },
  days: {
    letter: 'D',
    options: [ 1, 2, 3, 4, 6, 9 ],
    daysFactor: 1
  },
  weeks: {
    letter: 'W',
    options: [ 1, 2, 3, 6, 10, 25 ],
    daysFactor: 7
  },
  months: {
    letter: 'M',
    options: [ 1, 2, 3, 4, 6, 9 ],
    daysFactor: 365.25 / 12
  },
  years: {
    letter: 'Y',
    options: [ 1, 2, 3, 4, 5, 10 ],
    daysFactor: 365.25
  }
}

Object.values(categoriesInMenu).forEach(categoryData => {
  const { letter, daysFactor } = categoryData
  categoryData.optionsData = categoryData.options.map(num => {
    const bgColor = getColor(num, daysFactor)
    const frequency = `${num}${letter}`
    const { frequencyLabel } = parseFrequency(frequency)
    return {
      num,
      unit: letter,
      frequency,
      frequencyLabel,
      bgColor,
      // Adjusting thresold darkest color to match "1 year"
      // and have the full years line in the same color
      color: bgColor <= '#494949' ? 'white' : 'black',
    }
  })
})

const typingOnly = {
  minutes: {
    letter: 'T'
  }
}

export const allOptions = Object.assign({}, typingOnly, categoriesInMenu)

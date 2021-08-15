import { parse, isInFolder } from '../lib/bookmarks'
import optionsEl from './periodicity_options'
import './footer'
import updateNextVisit from './next_visit'

const addCustomFrequencyButton = require('./add_custom_frequency_button')(optionsEl)
const defaultFrequency = '1M'

export default async function (bookmarkData) {
  if (await isInFolder(bookmarkData)) {
    const parsedData = parse(bookmarkData)
    if (parsedData) {
      updateNextVisit(parsedData.nextVisit)
      // catch float frequencies (that are necessarly custom) before the select function
      // tries to use document.querySelector on an invalid selector (due to the dot)
      if (floatFrequency(parsedData.frequency)) {
        addCustomFrequencyButton()
      } else {
        select(frequencySelector(parsedData.frequency))
      }
    } else {
      console.error('bookmark in folder but impossible to parse data', bookmarkData)
      select('.never')
    }
  } else {
    select(frequencySelector(defaultFrequency))
  }
}

function select (selector) {
  const el = document.querySelector(selector)
  if (el) el.classList.add('selected')
  else addCustomFrequencyButton()
}

const frequencySelector = frequency => `.frequency-${frequency}`
const floatFrequency = frequency => /\./.test(frequency)

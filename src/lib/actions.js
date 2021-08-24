import { enable, disable } from './icon'
import { removeById, updateTitle, add } from './bookmarks'
import { getCurrentUrlBookmarkId, getCurrentUrlBookmarkData, getActive } from './tabs'

export async function setFrequency (frequency) {
  if (!frequency) throw new Error('missing frequency')
  enable(frequency)
  await saveCurrentUrlPeriodicity(frequency)
}

export default {
  setFrequency,
  select: e => setFrequency(e.target.attributes['data-frequency'].value),
  remove: () => {
    disable()
    getCurrentUrlBookmarkId()
    .then(bookmarkId => {
      if (bookmarkId) removeById(bookmarkId)
    })
    .then(window.close)
  }
}

export const saveCurrentUrlPeriodicity = async frequency => {
  const bookmarkData = await getCurrentUrlBookmarkData()
  const bookmarkId = bookmarkData && bookmarkData.id
  console.log({ bookmarkData, bookmarkId })
  if (bookmarkId) {
    return updateTitle(bookmarkId, bookmarkData.title, frequency)
  } else {
    const tabData = await getActive()
    console.log('tabData', tabData)
    return add(tabData.url, tabData.title, frequency)
  }
}

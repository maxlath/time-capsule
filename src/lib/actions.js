import { enable, disable } from './icon.js'
import { removeById, updateTitle, add } from './bookmarks.js'
import { getActive, getUrlBookmarkData } from './tabs.js'

export async function setFrequency ({ url, frequency, context }) {
  if (!frequency) throw new Error('missing frequency')
  if (!url) throw new Error('missing url')
  if (context === 'popup') {
    if (frequency === 'never') {
      disable()
    } else {
      enable(frequency)
    }
  }
  return saveUrlPeriodicity({ url, frequency })
}

async function saveUrlPeriodicity ({ url, frequency }) {
  const bookmarkData = await getUrlBookmarkData(url)
  const bookmarkId = bookmarkData?.id
  if (frequency === 'never') {
    if (bookmarkId) await removeById(bookmarkId)
  } else if (bookmarkId) {
    return updateTitle(bookmarkId, bookmarkData.title, frequency)
  } else {
    const tabData = await getActive()
    return add(tabData.url, tabData.title, frequency)
  }
}

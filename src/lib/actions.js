import { enable, disable } from './icon.js'
import { removeById, updateCapsuleData, add } from './bookmarks.js'
import { getActiveTab, getUrlBookmarkData } from './tabs.js'

export async function saveCapsule ({ url, bookmark, nextVisit, frequency, repeat, context }) {
  if (!frequency) throw new Error('missing frequency')
  if (!(url || bookmark)) throw new Error('missing url')
  bookmark = bookmark || await getUrlBookmarkData(url)
  if (context === 'popup') {
    if (frequency === 'never') {
      disable()
    } else {
      enable(frequency)
    }
  }
  const bookmarkId = bookmark.id
  if (frequency === 'never') {
    if (bookmarkId) await removeById(bookmarkId)
  } else if (bookmarkId) {
    return updateCapsuleData({
      bookmarkData: bookmark,
      nextVisit,
      repeat,
      newFrequency: frequency,
    })
  } else {
    const tabData = await getActiveTab()
    return add(tabData.url, tabData.title, frequency)
  }
}

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
    return updateCapsuleData({ bookmarkData, newFrequency: frequency })
  } else {
    const tabData = await getActiveTab()
    return add(tabData.url, tabData.title, frequency)
  }
}

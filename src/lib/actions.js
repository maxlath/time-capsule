import { enable, disable } from './icon.js'
import { removeBookmark, updateCapsuleData, add } from './bookmarks.js'
import { getActiveTab, getActiveTabUrlBookmarkData } from './tabs.js'

export async function saveCapsule ({ url, bookmark, nextVisit, frequency, repeat, context }) {
  if (!frequency) throw new Error('missing frequency')
  if (!(url || bookmark)) throw new Error('missing url')
  bookmark = bookmark || await getActiveTabUrlBookmarkData(url)
  if (context === 'popup') {
    if (frequency === 'never') {
      disable()
    } else {
      enable(frequency)
    }
  }
  const bookmarkId = bookmark?.id
  if (frequency === 'never') {
    if (bookmarkId) await removeBookmark(bookmark)
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
  // TODO: Reset repeat to default value
  return saveUrlPeriodicity({ url, frequency })
}

async function saveUrlPeriodicity ({ url, frequency }) {
  const bookmark = await getActiveTabUrlBookmarkData(url)
  const bookmarkId = bookmark?.id
  if (frequency === 'never') {
    if (bookmarkId) await removeBookmark(bookmark)
  } else if (bookmarkId) {
    return updateCapsuleData({ bookmarkData: bookmark, newFrequency: frequency })
  } else {
    const tabData = await getActiveTab()
    return add(tabData.url, tabData.title, frequency)
  }
}

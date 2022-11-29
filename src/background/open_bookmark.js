import { createTab } from '../lib/tabs.js'
import { getById, updateCapsuleData } from '../lib/bookmarks.js'

export async function openBookmark (bookmark) {
  console.log('opening', bookmark)
  const bookmarkData = await getById(bookmark.id)
  Object.assign(bookmarkData, bookmark)
  if (bookmarkData) {
    await createTab({ url: bookmarkData.url, active: false })
    // re-set the periodicity data
    await updateCapsuleData({ bookmarkData })
  } else {
    console.error('bookmark data not found', bookmark)
  }
}

import { createTab } from '../lib/tabs.js'
import { getById, removeById, updateCapsuleData } from '../lib/bookmarks.js'
import { isPositiveIntegerString } from '../lib/utils.js'

export async function openBookmark (bookmark) {
  console.log('opening', bookmark)
  const bookmarkData = await getById(bookmark.id)
  Object.assign(bookmarkData, bookmark)
  if (bookmarkData) {
    await createTab({ url: bookmarkData.url, active: false })
    if (bookmarkData.repeat === 0) {
      return removeById(bookmark.id)
    } else if (isPositiveIntegerString(bookmarkData.repeat)) {
      bookmarkData.repeat -= 1
    }
    await updateCapsuleData({ bookmarkData })
  } else {
    console.error('bookmark data not found', bookmark)
  }
}

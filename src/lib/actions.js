import { updateCapsuleData, getBookmarksByUrl, addCapsule } from './bookmarks.js'
import { getActiveTab } from './tabs.js'
import { serializeBookmark } from './bookmark_title.js'

export async function saveCapsule ({ url, bookmark, nextVisit, frequency, repeat }) {
  if (!frequency && repeat !== 0) throw new Error('missing frequency')
  if (!(url || bookmark)) throw new Error('missing url')
  let archivedBookmark
  if (!bookmark) {
    const res = await getBookmarksByUrl(url)
    if (res.capsuleBookmark) bookmark = serializeBookmark(res.capsuleBookmark)
    else if (res.archivedBookmark) archivedBookmark = res.archivedBookmark
  }
  const bookmarkId = bookmark?.id
  if (bookmarkId || archivedBookmark) {
    return updateCapsuleData({
      bookmarkData: bookmark || archivedBookmark,
      nextVisit,
      repeat,
      newFrequency: frequency,
    })
  } else {
    const tabData = await getActiveTab()
    return addCapsule({
      url: tabData.url,
      title: tabData.title,
      repeat,
      frequency,
      nextVisit,
    })
  }
}

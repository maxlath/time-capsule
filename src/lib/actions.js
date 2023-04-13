import { updateCapsuleData, getBookmarksByUrl, addCapsule } from './bookmarks.js'
import { getActiveTab } from './tabs.js'
import { serializeBookmark } from './bookmark_title.js'

export async function saveCapsule ({ url, title, bookmark, nextVisit, frequency, repeat, noRegrouping }) {
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
    const bookmarkData = bookmark || archivedBookmark
    if (title) bookmarkData.title = title
    return updateCapsuleData({
      bookmarkData,
      nextVisit,
      repeat,
      newFrequency: frequency,
      noRegrouping,
    })
  } else {
    const tabData = await getActiveTab()
    return addCapsule({
      url: url || tabData.url,
      title: title || tabData.title,
      repeat,
      frequency,
      nextVisit,
      noRegrouping,
    })
  }
}

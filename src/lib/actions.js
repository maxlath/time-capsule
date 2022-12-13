import { enable, disable } from './icon.js'
import { removeBookmark, updateCapsuleData, add, getBookmarksByUrl } from './bookmarks.js'
import { getActiveTab } from './tabs.js'
import { serializeBookmark } from './bookmark_title.js'

export async function saveCapsule ({ url, bookmark, nextVisit, frequency, repeat, context }) {
  if (!frequency) throw new Error('missing frequency')
  if (!(url || bookmark)) throw new Error('missing url')
  let archivedBookmark
  if (!bookmark) {
    const res = await getBookmarksByUrl(url)
    if (res.capsuleBookmark) bookmark = serializeBookmark(res.capsuleBookmark)
    else if (res.archivedBookmark) archivedBookmark = res.archivedBookmark
  }
  updateIcon({ context, frequency })
  const bookmarkId = bookmark?.id
  if (frequency === 'never') {
    if (bookmarkId) await removeBookmark(bookmark)
  } else if (bookmarkId || archivedBookmark) {
    return updateCapsuleData({
      bookmarkData: bookmark || archivedBookmark,
      nextVisit,
      repeat,
      newFrequency: frequency,
    })
  } else {
    const tabData = await getActiveTab()
    return add(tabData.url, tabData.title, frequency)
  }
}

function updateIcon ({ context, frequency }) {
  if (context === 'popup') {
    if (frequency === 'never') {
      disable()
    } else {
      enable(frequency)
    }
  }
}

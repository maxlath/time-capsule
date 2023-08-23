import { enable, disable } from '../lib/icon.js'
import { archiveFolderId, getBookmarkById, getCapsuleBookmarkByUrl } from '../lib/bookmarks.js'
import { possiblyOutdatedBookmarkData } from './open_bookmark.js'
import { serializeBookmark } from '../lib/bookmark_title.js'

export async function updateIconFromUrl ({ url, tabId }) {
  const bookmark = await getCapsuleBookmarkByUrl(url)
  return updateIconFromBookmark({ bookmark, tabId })
}

export async function updateIconFromBookmark ({ bookmark, tabId }) {
  if (bookmark?.parentId === archiveFolderId) {
    disable()
    return
  }
  if (bookmark) {
    tabBookmarkFound({ bookmark })
    return
  }
  if (tabId) {
    const { bookmarkId, possibleUpdate } = possiblyOutdatedBookmarkData[tabId] || {}
    if (bookmarkId) {
      const bookmark = await getBookmarkById(bookmarkId)
      if (bookmark) {
        tabBookmarkFound({ bookmark, possibleUpdate })
        return
      }
    }
  }
  disable()
}

const tabBookmarkFound = ({ bookmark, possibleUpdate }) => {
  bookmark = serializeBookmark(bookmark)
  if (bookmark) {
    enable({
      frequency: bookmark.frequency,
      nextVisit: bookmark.nextVisit,
      warning: possibleUpdate != null
    })
  } else {
    // Known case: if the bookmark title was manually modified and made unparsable
    disable()
  }
}

import { enable, disable } from '../lib/icon.js'
import { getById, getCapsuleBookmarkByUrl } from '../lib/bookmarks.js'
import { possiblyOutdatedBookmarkData } from './open_bookmark.js'
import { serializeBookmark } from '../lib/bookmark_title.js'

export async function updateIcon ({ url, tabId }) {
  const bookmark = await getCapsuleBookmarkByUrl(url)
  if (bookmark) return pageFound({ bookmark })
  if (tabId) {
    const { bookmarkId, possibleUpdate } = possiblyOutdatedBookmarkData[tabId] || {}
    if (bookmarkId) {
      const bookmark = await getById(bookmarkId)
      if (bookmark) return pageFound({ bookmark, possibleUpdate })
    }
  }

  pageDataNotFound()
}

const pageFound = ({ bookmark, possibleUpdate }) => {
  bookmark = serializeBookmark(bookmark)
  if (bookmark) {
    enable(bookmark.frequency, {
      warning: possibleUpdate != null
    })
  } else {
    // Known case: if the bookmark title was manually modified and made unparsable
    disable()
  }
}

const pageDataNotFound = () => disable()

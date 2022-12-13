import { nextVisitIsToday } from '../lib/bookmarks.js'
import { serializeBookmark } from '../lib/bookmark_title.js'
import { openBookmark } from './open_bookmark.js'

const timeoutIds = {}

export const schedule = bookmark => {
  const now = Date.now()
  const time = bookmark.nextVisit - now
  if (time <= 0) {
    console.log('passed date, opening now:', bookmark)
    openBookmark(bookmark)
  } else {
    console.log('in the coming 24 hours:', time, bookmark)
    const { id: bookmarkId } = bookmark
    const openAndClean = () => {
      openBookmark(bookmark)
      delete timeoutIds[bookmarkId]
    }
    console.log('scheduling', { bookmark, time, now })
    timeoutIds[bookmarkId] = setTimeout(openAndClean, time)
  }
}

export const scheduleFromUnparsedBookmark = unparsedBookmark => {
  const parsedBookmark = serializeBookmark(unparsedBookmark)
  if (nextVisitIsToday(parsedBookmark)) schedule(parsedBookmark)
}

export const cancelPending = bookmarkId => {
  console.log('cancelling', bookmarkId, timeoutIds[bookmarkId])
  clearTimeout(timeoutIds[bookmarkId])
}

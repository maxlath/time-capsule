import { isInFolder, nextVisitIsToday } from '../lib/bookmarks.js'
import { toIso } from '../lib/times.js'
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
    console.log('scheduling', { bookmark, time, now: toIso(now), then: toIso(now + time) })
    timeoutIds[bookmarkId] = setTimeout(openAndClean, time)
  }
}

export async function reschedule (bookmark) {
  cancelPending(bookmark.id)
  if (await isInFolder(bookmark) && nextVisitIsToday(bookmark)) {
    schedule(bookmark)
  }
}

export const cancelPending = bookmarkId => {
  if (!timeoutIds[bookmarkId]) return
  console.log('cancelling', bookmarkId, timeoutIds[bookmarkId])
  clearTimeout(timeoutIds[bookmarkId])
}

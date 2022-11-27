import { parse } from '../lib/bookmarks'
import open from './open_bookmark'
import nextVisitIsToday from '../lib/next_visit_is_today'

const timeoutIds = {}

export const schedule = (now, bookmark) => {
  const time = bookmark.nextVisit - now
  if (time <= 0) {
    console.log('passed date, opening now:', bookmark)
    open(bookmark)
  } else {
    console.log('in the coming 24 hours:', time, bookmark)
    const { id: bookmarkId } = bookmark
    const openAndClean = () => {
      open(bookmark)
      delete timeoutIds[bookmarkId]
    }
    console.log('scheduling', { bookmark, time, now })
    timeoutIds[bookmarkId] = setTimeout(openAndClean, time)
  }
}

export const scheduleFromUnparsedBookmark = unparsedBookmark => {
  const parsedBookmark = parse(unparsedBookmark)
  if (nextVisitIsToday(parsedBookmark)) schedule(Date.now(), parsedBookmark)
}

export const cancelPending = bookmarkId => {
  console.log('cancelling', bookmarkId, timeoutIds[bookmarkId])
  clearTimeout(timeoutIds[bookmarkId])
}

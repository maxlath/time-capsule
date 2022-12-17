import { getTodaysBookmarksData, nextVisitIsInThePast, getBookmarkById } from '../lib/bookmarks.js'
import { schedule, cancelPending, reschedule } from './schedule.js'
import { D as oneDay } from '../lib/times.js'
import { set } from '../lib/day_end.js'
import { partition } from '../lib/utils.js'
import { getSettingValue } from '../lib/settings_store.js'
import { processBookmarkWithoutOpening } from './open_bookmark.js'

const openTodaysBookmarks = async () => {
  // this function as the monopoly on setting the day end
  // and every one else simply reading from it
  set()
  const todaysBookmarks = await getTodaysBookmarksData()
  const maxCapsules = await getSettingValue('settings:maxCapsules')
  const [ bookmarksToOpenImmediately, bookmarksForLaterToday ] = partition(todaysBookmarks, nextVisitIsInThePast)
  console.log("today's program", { bookmarksToOpenImmediately, bookmarksForLaterToday })
  if (bookmarksToOpenImmediately.length > maxCapsules) {
    const ids = bookmarksToOpenImmediately.map(bookmark => bookmark.id)
    bookmarksForLaterToday.forEach(schedule)
    // TODO: Add corresponding log record
    await Promise.all(bookmarksToOpenImmediately.map(processBookmarkWithoutOpening))
    browser.tabs.create({ url: `/overflow/overflow.html?ids=${ids.join('|')}` })
  } else {
    todaysBookmarks.forEach(schedule)
  }
}

openTodaysBookmarks()
setInterval(openTodaysBookmarks, oneDay)

const rescheduleFromEvent = async (id, bookmark) => {
  // Weirdly, the bookmark data is incomplete there:
  // notably, it misses its id and parentId, thus getting it afresh
  const bookmarkData = await getBookmarkById(id)
  await reschedule(bookmarkData)
}

browser.bookmarks.onCreated.addListener(rescheduleFromEvent)
browser.bookmarks.onChanged.addListener(rescheduleFromEvent)
browser.bookmarks.onRemoved.addListener(cancelPending)

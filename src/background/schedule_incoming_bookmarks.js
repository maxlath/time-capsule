import { getTodaysBookmarksData, nextVisitIsInThePast, getBookmarkById } from '../lib/bookmarks.js'
import { schedule, cancelPending, reschedule, getBlockedWeekTimes } from './schedule.js'
import { timeUntilLocalDayEndTime } from '../lib/times.js'
import { partition } from '../lib/utils.js'
import { getSettingValue } from '../lib/settings_store.js'
import { processBookmarkWithoutOpening } from './open_bookmark.js'
import { getNextNonBlockedTime } from '../settings/week_time_picker_helpers.js'

const scheduleTodaysBookmarks = async () => {
  // In any case, call this function again tomorrow at 00:00:01
  setTimeout(scheduleTodaysBookmarks, timeUntilLocalDayEndTime() + 1000)

  const blockedWeekTimes = await getBlockedWeekTimes()
  if (blockedWeekTimes) {
    const nextNonBlockedTime = getNextNonBlockedTime(blockedWeekTimes)
    // Blocked until the end of the day, so nothing to schedule today
    if (!nextNonBlockedTime) return
  }

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

scheduleTodaysBookmarks()

const rescheduleFromEvent = async (id, bookmark) => {
  // Weirdly, the bookmark data is incomplete there:
  // notably, it misses its id and parentId, thus getting it afresh
  const bookmarkData = await getBookmarkById(id)
  await reschedule(bookmarkData)
}

browser.bookmarks.onCreated.addListener(rescheduleFromEvent)
browser.bookmarks.onChanged.addListener(rescheduleFromEvent)
browser.bookmarks.onRemoved.addListener(cancelPending)
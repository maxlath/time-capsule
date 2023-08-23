import { getTodaysBookmarksData, nextVisitIsInThePast, getBookmarkById, isRegroupable } from '../lib/bookmarks.js'
import { schedule, cancelPending, reschedule, getBlockedWeekTimes, cancelAllPendingBookmarks } from './schedule.js'
import { timeUntilLocalDayEndTime, toIso } from '../lib/times.js'
import { partition } from '../lib/utils.js'
import { getSettingStore, getSettingValues } from '../lib/settings_store.js'
import { openOverflowMenu } from './open_bookmark.js'
import { getNextNonBlockedTime } from '../settings/week_time_picker_helpers.js'
import debounce from 'lodash.debounce'

let nextDayTimeout, nextNonBlockedTimeTimeout

const scheduleTodaysBookmarks = async () => {
  await cancelAllScheduledEvents()

  // In any case, call this function again tomorrow at 00:00:01
  nextDayTimeout = setTimeout(scheduleTodaysBookmarks, timeUntilLocalDayEndTime() + 1000)

  const blockedWeekTimes = await getBlockedWeekTimes()
  if (blockedWeekTimes) {
    const nextNonBlockedTime = getNextNonBlockedTime(blockedWeekTimes)
    // Blocked until the end of the day, so nothing to schedule today
    if (!nextNonBlockedTime) {
      console.log('scheduling canceled for today due to blocked time slot')
      return
    }
    // Retry then
    const delay = nextNonBlockedTime - Date.now()
    if (delay > 1000) {
      console.log('scheduling delayed due to blocked time slot', { nextNonBlockedTime: toIso(nextNonBlockedTime) })
      nextNonBlockedTimeTimeout = setTimeout(scheduleTodaysBookmarks, delay)
      return
    }
  }

  const todaysBookmarks = await getTodaysBookmarksData()
  const {
    'settings:maxCapsules': maxCapsules,
    'settings:keepExpiredCapsulesAsNormalBookmarks': keepExpiredCapsulesAsNormalBookmarks,
  } = await getSettingValues([
    'settings:maxCapsules',
    'settings:keepExpiredCapsulesAsNormalBookmarks',
  ])
  const [ bookmarksToOpenImmediately, bookmarksForLaterToday ] = partition(todaysBookmarks, nextVisitIsInThePast)
  const [ regroupableBookmarks, nonRegroupableBookmarks ] = partition(bookmarksToOpenImmediately, bookmark => isRegroupable({ bookmark, keepExpiredCapsulesAsNormalBookmarks }))
  console.log("today's program", { bookmarksToOpenImmediately, bookmarksForLaterToday })
  if (regroupableBookmarks.length > maxCapsules) {
    bookmarksForLaterToday.forEach(schedule)
    nonRegroupableBookmarks.forEach(schedule)
    await openOverflowMenu(regroupableBookmarks)
  } else {
    todaysBookmarks.forEach(schedule)
  }
}

async function cancelAllScheduledEvents () {
  if (nextDayTimeout) clearTimeout(nextDayTimeout)
  if (nextNonBlockedTimeTimeout) clearTimeout(nextNonBlockedTimeTimeout)
  await cancelAllPendingBookmarks()
}

const rescheduleFromEvent = async (id, bookmark) => {
  // Weirdly, the bookmark data is incomplete there:
  // notably, it misses its id and parentId, thus getting it afresh
  const bookmarkData = await getBookmarkById(id)
  await reschedule(bookmarkData)
}

browser.bookmarks.onCreated.addListener(rescheduleFromEvent)
browser.bookmarks.onChanged.addListener(rescheduleFromEvent)
browser.bookmarks.onRemoved.addListener(cancelPending)

const lazyScheduleTodaysBookmarks = debounce(scheduleTodaysBookmarks, 1000)

// Reschedule when settings related to scheduling change
getSettingStore('settings:enableBlockedWeekTimes').subscribe(lazyScheduleTodaysBookmarks)
getSettingStore('settings:blockedWeekTimes').subscribe(lazyScheduleTodaysBookmarks)

// Make explicit that we want to call scheduleTodaysBookmarks on startup
// Even if store subscribers would have done it by themselves
lazyScheduleTodaysBookmarks()

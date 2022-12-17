import { isInFolder, nextVisitIsToday } from '../lib/bookmarks.js'
import { getSettingValues } from '../lib/settings_store.js'
import { toIso } from '../lib/times.js'
import { getNextNonBlockedTime } from '../settings/week_time_picker_helpers.js'
import { openBookmark } from './open_bookmark.js'

const timeoutIds = {}

export async function schedule (bookmark) {
  const blockedWeekTimes = await getBlockedWeekTimes()
  const nextNonBlockedTime = getNextNonBlockedTime(blockedWeekTimes)
  if (!nextNonBlockedTime) throw new Error('no next non-blocked time found today')

  let nextVisitTime = bookmark.nextVisit
  if (nextNonBlockedTime > bookmark.nextVisit) {
    // TODO: handle maxCapsule setting overflow
    console.log('opening delayed due to blocked time slot', bookmark, {
      nextVisitTime: toIso(nextVisitTime),
      nextNonBlockedTime: toIso(nextNonBlockedTime),
    })
    nextVisitTime = nextNonBlockedTime
  }

  const now = Date.now()
  const time = nextVisitTime - now
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

export async function getBlockedWeekTimes () {
  const {
    'settings:enableBlockedWeekTimes': enableBlockedWeekTimes,
    'settings:blockedWeekTimes': blockedWeekTimes,
  } = await getSettingValues([
    'settings:enableBlockedWeekTimes',
    'settings:blockedWeekTimes',
  ])

  if (enableBlockedWeekTimes) return blockedWeekTimes
}

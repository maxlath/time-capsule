import { getBookmarkById, isInFolder, nextVisitIsToday } from '../lib/bookmarks.js'
import { getSettingValues } from '../lib/settings_store.js'
import { toIso } from '../lib/times.js'
import { getNextNonBlockedTime } from '../settings/week_time_picker_helpers.js'
import { openSingleBookmarkOrOverflowMenu } from './open_bookmark.js'

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
    await openSingleBookmarkOrOverflowMenu(bookmark)
  } else {
    console.log('in the coming 24 hours:', time, bookmark)
    console.log('scheduling', { bookmark, time, now: toIso(now), then: toIso(now + time) })
    await browser.alarms.create(getAlarmName('open', bookmark.id), { when: nextVisitTime })
  }
}

const getAlarmName = (action, bookmarkId) => `${action}:${bookmarkId}`

browser.alarms.onAlarm.addListener(async ({ name }) => {
  const [ action, bookmarkId ] = name.split(':')
  if (action === 'open') {
    const bookmark = await getBookmarkById(bookmarkId)
    await openSingleBookmarkOrOverflowMenu(bookmark)
  }
})

export async function reschedule (bookmark) {
  await cancelPending(bookmark.id)
  if (await isInFolder(bookmark) && nextVisitIsToday(bookmark)) {
    await schedule(bookmark)
  }
}

export async function cancelPending (bookmarkId) {
  console.log('cancelling', bookmarkId)
  await browser.alarms.clear(getAlarmName('open', bookmarkId))
}

export async function cancelAllPendingBookmarks () {
  console.log('cancelling all pending bookmarks', await browser.alarms.getAll())
  await browser.alarms.clearAll()
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

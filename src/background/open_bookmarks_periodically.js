import { Error } from '../lib/utils'
import { getTodaysBookmarksData, getById, isInFolder } from '../lib/bookmarks'
import { schedule, scheduleFromUnparsedBookmark, cancelPending } from './schedule'
import { D as oneDay } from '../lib/times'
import { set } from '../lib/day_end'

const openTodaysBookmarks = () => {
  // this function as the monopoly on setting the day end
  // and every one else simply reading from it
  set()
  getTodaysBookmarksData()
  .then(todaysBookmarks => {
    todaysBookmarks.forEach(schedule.bind(null, Date.now()))
  })
  .catch(Error('openTodaysBookmarks'))
}

openTodaysBookmarks()
setInterval(openTodaysBookmarks, oneDay)

const reschedule = async (id, bookmark) => {
  // Weirdly, the bookmark data is incomplete there:
  // notably, it misses its id and parentId, thus getting it afresh
  const bookmarkData = await getById(id)
  if (await isInFolder(bookmarkData)) {
    cancelPending(id)
    scheduleFromUnparsedBookmark(bookmarkData)
  }
}

browser.bookmarks.onCreated.addListener(reschedule)
browser.bookmarks.onChanged.addListener(reschedule)
browser.bookmarks.onRemoved.addListener(cancelPending)

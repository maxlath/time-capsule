import { getSettingValue } from './settings_store.js'
import { i18n } from '../lib/i18n.js'
import { serializeBookmark } from './bookmark_title.js'

export async function createLogRecord ({ event, bookmark, changes, url, bookmarks }) {
  const record = {
    event,
    timestamp: Date.now(),
  }
  if (bookmark) {
    if (bookmark.cleanedTitle == null) {
      bookmark = serializeBookmark(bookmark)
    }
    console.log(event, bookmark)
    Object.assign(record, {
      id: `${bookmark.id}:${record.timestamp}`,
      bookmarkId: bookmark.id,
      url: bookmark.url,
      title: bookmark.cleanedTitle,
      frequency: bookmark.frequency,
      remainingRepeats: bookmark.repeat,
      changes,
    })
  } else {
    // Only case: 'opened-overflow-menu'
    Object.assign(record, {
      id: `${url}:${record.timestamp}`,
      url,
      title: bookmarks.map(({ cleanedTitle }) => cleanedTitle).join(', ')
    })
  }
  let logs = await getLogRecords()
  logs.unshift(record)
  logs = await enforceRecordsLimits(logs)
  await browser.storage.local.set({ logs })
}

export async function getLogRecords () {
  let { logs } = await browser.storage.local.get('logs')
  if (!(logs instanceof Array)) logs = []
  // Return possibly less records than stored, to be consistent with the current setting value
  return enforceRecordsLimits(logs)
}

async function enforceRecordsLimits (logs) {
  const logsMaxRecords = await getSettingValue('settings:logsMaxRecords')
  return logs.slice(0, logsMaxRecords)
}

export const events = {
  'opened-bookmark': {
    label: i18n('Opened'),
  },
  'skipped-already-opened-bookmark': {
    label: i18n('Skipped'),
  },
  'opened-overflow-menu': {
    label: i18n('Overflow'),
  },
  'created-bookmark': {
    label: i18n('Created'),
  },
  'updated-bookmark': {
    label: i18n('Updated'),
  },
  'archived-bookmark': {
    label: i18n('Archived'),
  },
  'removed-bookmark': {
    label: i18n('Removed'),
  },
}

export async function clearLogs () {
  await browser.storage.local.set({ logs: [] })
}

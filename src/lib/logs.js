import { parse } from './bookmarks.js'
import { getSettingValue } from './settings_store.js'
import { i18n } from '../lib/i18n.js'

export async function createLogRecord ({ event, bookmark }) {
  if (bookmark.cleanedTitle == null) {
    bookmark = parse(bookmark)
  }
  console.log(event, bookmark)
  const record = {
    event,
    timestamp: Date.now(),
    bookmarkId: bookmark.id,
    url: bookmark.url,
    title: bookmark.cleanedTitle,
    frequency: bookmark.frequency,
    remainingRepeats: bookmark.repeat,
  }
  let logs = await getLogRecords()
  logs.unshift(record)
  logs = await enforceRecordsLimits(logs)
  await browser.storage.sync.set({ logs })
}

export async function getLogRecords () {
  let { logs } = await browser.storage.sync.get('logs')
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
  'created-bookmark': {
    label: i18n('Created'),
  },
  'updated-bookmark': {
    label: i18n('Updated'),
  },
  'removed-bookmark': {
    label: i18n('Removed'),
  },
}

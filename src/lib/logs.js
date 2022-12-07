import { getSettingValue } from './settings_store.js'

export async function createLogRecord (record) {
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

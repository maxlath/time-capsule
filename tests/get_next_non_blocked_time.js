import should from 'should'
import { hour } from '../src/lib/times.js'
import { range } from '../src/lib/utils.js'
import { getCurrentSlotIndex, getNextNonBlockedTime, getTodayCode, initWeekTimes } from '../src/settings/week_time_picker_helpers.js'

describe('getNextNonBlockedTime', () => {
  it('should return the current time slot when no blocked time is set', () => {
    const blockedWeekTimes = initWeekTimes()
    const nextNonBlockedTime = getNextNonBlockedTime(blockedWeekTimes)
    nextNonBlockedTime.should.be.belowOrEqual(Date.now())
  })

  it('should return the next time slot when the current time slot is blocked', () => {
    const blockedWeekTimes = initWeekTimes()
    const today = getTodayCode()
    const slot = getCurrentSlotIndex()
    blockedWeekTimes[today][slot] = true
    const nextNonBlockedTime = getNextNonBlockedTime(blockedWeekTimes)
    // This test will fail when run just before the end of the day
    nextNonBlockedTime.should.be.above(Date.now())
    nextNonBlockedTime.should.be.belowOrEqual(Date.now() + hour)
  })

  it('should not return anything when no slot is possible today', () => {
    const blockedWeekTimes = initWeekTimes()
    const today = getTodayCode()
    for (const slotIndex of range(getCurrentSlotIndex(), 23)) {
      blockedWeekTimes[today][slotIndex] = true
    }
    const nextNonBlockedTime = getNextNonBlockedTime(blockedWeekTimes)
    should(nextNonBlockedTime).not.be.ok()
  })
})

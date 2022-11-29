import should from 'should'
import { getNextVisit } from '../src/lib/bookmark_title.js'
import { getDay, getHours, getMinutes, getMonth, getYear, hour, minute, setDay, setHours, setMinutes, setMonth, setYear } from '../src/lib/times.js'

describe('getNextVisit', () => {
  describe('minute', () => {
    it('should get the next visit date', () => {
      const now = new Date()
      const minutesNow = getMinutes(now)
      const nextVisit = getNextVisit({ frequency: '10T', referenceDate: now })
      const then = setMinutes(now, minutesNow + 10)
      getMinutes(nextVisit).should.equal(getMinutes(then))
      getHours(nextVisit).should.equal(getHours(now))
      getDay(nextVisit).should.equal(getDay(now))
      getMonth(nextVisit).should.equal(getMonth(now))
      getYear(nextVisit).should.equal(getYear(now))
    })
  })

  describe('hour', () => {
    it('should get the next visit date', () => {
      const now = new Date()
      const hoursNow = getHours(now)
      const nextVisit = getNextVisit({ frequency: '5H', referenceDate: now })
      const then = setHours(now, hoursNow + 5)
      getMinutes(nextVisit).should.equal(getMinutes(now))
      getHours(nextVisit).should.equal(getHours(then))
      getDay(nextVisit).should.equal(getDay(then))
      getMonth(nextVisit).should.equal(getMonth(then))
      getYear(nextVisit).should.equal(getYear(then))
    })

    it('should skip passed missed visits dates', () => {
      const now = Date.now()
      const someTenHoursAgo = new Date(now - 10 * hour + 5 * minute)
      const nextVisit = getNextVisit({ frequency: '1H', referenceDate: someTenHoursAgo })
      const nextVisitTime = new Date(nextVisit).getTime()
      should(nextVisitTime - now).equal(5 * minute)
    })
  })

  describe('day', () => {
    it('should get the next visit date', () => {
      const now = new Date()
      const daysNow = getDay(now)
      const nextVisit = getNextVisit({ frequency: '2D', referenceDate: now })
      const then = setDay(now, daysNow + 2)
      getMinutes(nextVisit).should.equal(getMinutes(now))
      getHours(nextVisit).should.equal(getHours(now))
      getDay(nextVisit).should.equal(getDay(then))
      getMonth(nextVisit).should.equal(getMonth(then))
      getYear(nextVisit).should.equal(getYear(then))
    })
  })

  describe('week', () => {
    it('should get the next visit date', () => {
      const now = new Date()
      const daysNow = getDay(now)
      const nextVisit = getNextVisit({ frequency: '13W', referenceDate: now })
      const then = setDay(now, daysNow + 7 * 13)
      getMinutes(nextVisit).should.equal(getMinutes(now))
      getHours(nextVisit).should.equal(getHours(now))
      getDay(nextVisit).should.equal(getDay(then))
      getMonth(nextVisit).should.equal(getMonth(then))
      getYear(nextVisit).should.equal(getYear(then))
    })
  })

  describe('month', () => {
    it('should get the next visit date', () => {
      const now = new Date()
      const monthNow = getMonth(now)
      const nextVisit = getNextVisit({ frequency: '10M', referenceDate: now })
      const then = setMonth(now, monthNow + 10)
      getMinutes(nextVisit).should.equal(getMinutes(now))
      getHours(nextVisit).should.equal(getHours(now))
      getDay(nextVisit).should.equal(getDay(now))
      getMonth(nextVisit).should.equal(getMonth(then))
      getYear(nextVisit).should.equal(getYear(then))
    })
  })

  describe('year', () => {
    it('should get the next visit date', () => {
      const now = new Date()
      const yearNow = getYear(now)
      const nextVisit = getNextVisit({ frequency: '5Y', referenceDate: now })
      const then = setYear(now, yearNow + 5)
      getMinutes(nextVisit).should.equal(getMinutes(now))
      getHours(nextVisit).should.equal(getHours(now))
      getDay(nextVisit).should.equal(getDay(now))
      getMonth(nextVisit).should.equal(getMonth(now))
      getYear(nextVisit).should.equal(getYear(then))
    })
  })
})

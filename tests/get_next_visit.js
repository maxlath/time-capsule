import 'should'
import { getNextVisit } from '../src/lib/bookmark_title.js'
import { getDay, getHours, getMinutes, getMonth, getYear, setDay, setHours, setMinutes, setMonth, setYear } from '../src/lib/times.js'

describe('getNextVisit', () => {
  describe('minute', () => {
    it('should get the next visit date', () => {
      const now = new Date()
      const minutesNow = getMinutes(now)
      const nextVisit = getNextVisit('10T')
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
      const nextVisit = getNextVisit('5H')
      const then = setHours(now, hoursNow + 5)
      getMinutes(nextVisit).should.equal(getMinutes(now))
      getHours(nextVisit).should.equal(getHours(then))
      getDay(nextVisit).should.equal(getDay(then))
      getMonth(nextVisit).should.equal(getMonth(then))
      getYear(nextVisit).should.equal(getYear(then))
    })
  })

  describe('day', () => {
    it('should get the next visit date', () => {
      const now = new Date()
      const daysNow = getDay(now)
      const nextVisit = getNextVisit('2D')
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
      const nextVisit = getNextVisit('13W')
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
      const nextVisit = getNextVisit('10M')
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
      const nextVisit = getNextVisit('5Y')
      const then = setYear(now, yearNow + 5)
      getMinutes(nextVisit).should.equal(getMinutes(now))
      getHours(nextVisit).should.equal(getHours(now))
      getDay(nextVisit).should.equal(getDay(now))
      getMonth(nextVisit).should.equal(getMonth(now))
      getYear(nextVisit).should.equal(getYear(then))
    })
  })
})

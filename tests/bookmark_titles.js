import should from 'should'
import { getNextVisit } from '../src/lib/bookmark_title.js'

describe('getNextVisit', () => {
  it('should get the next visit date', () => {
    const nextVisitTime = Date.now() + 10 * 60 * 1000
    const nextVisit = getNextVisit('10T')
    const nextVisitNumericDate = new Date(nextVisit).getTime()
    should(nextVisitNumericDate - nextVisitTime).be.below(10)
  })
})

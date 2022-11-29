import 'should'
import { incrementByTimeUnit } from '../src/lib/times.js'

describe('incrementByTimeUnit', () => {
  describe('months', () => {
    it('should do its best on irregular months', () => {
      const newDate = incrementByTimeUnit.M(new Date('2023-01-31'), 1)
      newDate.toISOString().split('T')[0].should.equal('2023-03-03')
    })
  })
})

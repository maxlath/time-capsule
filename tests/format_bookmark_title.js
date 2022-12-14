import 'should'
import { formatBookmarkTitle, parseBookmarkTitle } from '../src/lib/bookmark_title.js'

describe('formatBookmarkTitle', () => {
  it('should generate a parsable title', () => {
    const now = new Date().toISOString()
    const title = formatBookmarkTitle({ title: 'foo', frequency: '1M', referenceDate: now })
    const data = parseBookmarkTitle(title)
    data.cleanedTitle.should.equal('foo')
    data.frequency.should.equal('1M')
    new Date(data.referenceDate).toISOString().should.equal(now)
  })

  it('should support optional repeats', () => {
    const now = new Date().toISOString()
    const title = formatBookmarkTitle({ title: 'foo', frequency: '1M', referenceDate: now, repeat: 5 })
    const data = parseBookmarkTitle(title)
    data.repeat.should.equal(5)
  })

  it('should support a nextVisit date with 0 repeat instead of a frequency', () => {
    const nextVisitTime = Date.now() + 10000
    const nextVisit = new Date(nextVisitTime).toISOString()
    const title = formatBookmarkTitle({ title: 'foo', frequency: null, nextVisit, repeat: 0 })
    const data = parseBookmarkTitle(title)
    data.frequency.should.equal(0)
    data.repeat.should.equal(0)
  })
})

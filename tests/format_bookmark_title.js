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

  it('should support optional repetions', () => {
    const now = new Date().toISOString()
    const title = formatBookmarkTitle({ title: 'foo', frequency: '1M', referenceDate: now, repeat: 5 })
    const data = parseBookmarkTitle(title)
    data.repeat.should.equal(5)
  })
})

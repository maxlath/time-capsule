import should from 'should'
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
    should(data.frequency).not.be.ok()
    data.repeat.should.equal(0)
  })

  it('should support regrouping=true setting', () => {
    const now = new Date().toISOString()
    const title = formatBookmarkTitle({ title: 'foo', frequency: '1M', referenceDate: now, noRegrouping: true })
    const data = parseBookmarkTitle(title)
    data.noRegrouping.should.be.true()
  })

  it('should support regrouping=false setting', () => {
    const now = new Date().toISOString()
    const title = formatBookmarkTitle({ title: 'foo', frequency: '1M', referenceDate: now, noRegrouping: false })
    const data = parseBookmarkTitle(title)
    data.noRegrouping.should.be.false()
  })

  it('should support openAsActiveTab=true setting', () => {
    const now = new Date().toISOString()
    const title = formatBookmarkTitle({ title: 'foo', frequency: '1M', referenceDate: now, openAsActiveTab: true })
    const data = parseBookmarkTitle(title)
    data.openAsActiveTab.should.be.true()
  })

  it('should support openAsActiveTab=false setting', () => {
    const now = new Date().toISOString()
    const title = formatBookmarkTitle({ title: 'foo', frequency: '1M', referenceDate: now, openAsActiveTab: false })
    const data = parseBookmarkTitle(title)
    data.openAsActiveTab.should.be.false()
  })

  it('should support undefined openAsActiveTab setting', () => {
    const now = new Date().toISOString()
    const title = formatBookmarkTitle({ title: 'foo', frequency: '1M', referenceDate: now })
    const data = parseBookmarkTitle(title)
    should(data.openAsActiveTab).not.be.ok()
  })
})

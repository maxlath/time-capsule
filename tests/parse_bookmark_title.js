import { parseBookmarkTitle } from '../src/lib/bookmark_title.js'
import 'should'

describe('parseBookmarkTitle', () => {
  it('should parse legacy title format', () => {
    const title = 'Anamnesis (philosophy) - Wikipedia /ᐒ/ 6D 2022-12-04T16:48:06.111Z'
    const capsuleData = parseBookmarkTitle(title)
    capsuleData.cleanedTitle.should.equal('Anamnesis (philosophy) - Wikipedia')
    capsuleData.frequency.should.equal('6D')
    capsuleData.frequencyLabel.should.equal('6 day(s)')
    new Date(capsuleData.nextVisit).toISOString().should.equal('2022-12-04T16:48:06.111Z')
    capsuleData.nextVisit.should.equal(1670172486111)
  })

  it('should parse the 2022 new title format', () => {
    const title = 'Anamnesis (philosophy) - Wikipedia /ᐒ/ 6D ref=2022-11-28T16:48:06.111Z next=2022-12-04T16:48:06.111Z repeat=5'
    const capsuleData = parseBookmarkTitle(title)
    capsuleData.cleanedTitle.should.equal('Anamnesis (philosophy) - Wikipedia')
    capsuleData.frequency.should.equal('6D')
    capsuleData.frequencyLabel.should.equal('6 day(s)')
    new Date(capsuleData.referenceDate).toISOString().should.equal('2022-11-28T16:48:06.111Z')
    new Date(capsuleData.nextVisit).toISOString().should.equal('2022-12-04T16:48:06.111Z')
    capsuleData.repeat.should.equal(5)
  })

  it('should should default to repeat=∞', () => {
    const title = 'Anamnesis (philosophy) - Wikipedia /ᐒ/ 6D ref=2022-11-28T16:48:06.111Z next=2022-12-04T16:48:06.111Z'
    const capsuleData = parseBookmarkTitle(title)
    capsuleData.repeat.should.equal('∞')
  })

  it('should parse repeat=0', () => {
    const title = 'Anamnesis (philosophy) - Wikipedia /ᐒ/ 6D ref=2022-11-28T16:48:06.111Z next=2022-12-04T16:48:06.111Z repeat=0'
    const capsuleData = parseBookmarkTitle(title)
    capsuleData.repeat.should.equal(0)
  })

  it('should parse repeat=∞', () => {
    const title = 'Anamnesis (philosophy) - Wikipedia /ᐒ/ 6D ref=2022-11-28T16:48:06.111Z next=2022-12-04T16:48:06.111Z repeat=∞'
    const capsuleData = parseBookmarkTitle(title)
    capsuleData.repeat.should.equal('∞')
  })
})

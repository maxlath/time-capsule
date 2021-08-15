import { create } from '../lib/tabs'
import { getById, updateTitle } from '../lib/bookmarks'

export default function open (bookmark) {
  console.log('opening', bookmark)
  const { id, frequency } = bookmark
  return getById(bookmark.id)
  .then(bookmarkData => {
    if (bookmarkData) {
      const { title } = bookmarkData
      // open the tab
      return create({ url: bookmarkData.url, active: false })
      // re-set the periodicity data
      .then(updateTitle.bind(null, id, title, frequency))
      // update the view
    } else {
      console.error('bookmark data not found', bookmark)
    }
  })
}
//

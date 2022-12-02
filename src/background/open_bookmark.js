import { createTab, urlIsAlreadyOpened } from '../lib/tabs.js'
import { getById, removeById, updateCapsuleData } from '../lib/bookmarks.js'
import { isPositiveIntegerString } from '../lib/utils.js'
import { getSettingValue } from '../lib/settings_store.js'

export async function openBookmark (bookmark) {
  const bookmarkData = await getById(bookmark.id)
  if (!bookmarkData) {
    console.error('bookmark data not found', bookmark)
    return
  }
  const { url } = bookmarkData
  Object.assign(bookmarkData, bookmark)
  const [
    allowDuplicatedTabs,
    bookmarkUrlIsAlreadyOpened,
  ] = await Promise.all([
    getSettingValue('settings:allowDuplicatedTabs'),
    urlIsAlreadyOpened(url),
  ])
  if (!bookmarkUrlIsAlreadyOpened || allowDuplicatedTabs) {
    console.log('opening', bookmark)
    await createTab({ url, active: false })
  } else {
    console.log('already opened: skipping', bookmark)
  }
  if (bookmarkData.repeat === 0) {
    return removeById(bookmark.id)
  } else if (isPositiveIntegerString(bookmarkData.repeat)) {
    bookmarkData.repeat -= 1
  }
  await updateCapsuleData({ bookmarkData })
}

import { createTab, urlIsAlreadyOpened } from '../lib/tabs.js'
import { getById, archiveById, updateCapsuleData } from '../lib/bookmarks.js'
import { getSettingValue } from '../lib/settings_store.js'

export async function openBookmark (bookmark) {
  return processBookmark({ bookmark, doOpen: true })
}

export async function processBookmarkWithoutOpening (bookmark) {
  return processBookmark({ bookmark, doOpen: false })
}

async function processBookmark ({ bookmark, doOpen }) {
  const bookmarkData = await getById(bookmark.id)
  if (!bookmarkData) {
    console.error('bookmark data not found', bookmark)
    return
  }
  Object.assign(bookmarkData, bookmark)
  if (doOpen) await openBookmarkIfNeeded(bookmark)
  if (Number.isInteger(bookmarkData.repeat)) {
    bookmarkData.repeat -= 1
  }
  await updateCapsuleData({ bookmarkData })
  if (bookmarkData.repeat === 0) {
    return archiveById(bookmark.id)
  }
}

async function openBookmarkIfNeeded (bookmark) {
  const { url } = bookmark
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
}

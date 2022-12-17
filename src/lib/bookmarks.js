import { first, partition } from './utils.js'
import { initBookmarksFolders } from './bookmarks_init.js'
import { formatBookmarkTitle, serializeBookmark } from './bookmark_title.js'
import { getSettingValue } from './settings_store.js'
import { getLocalDayEndTime, timeIsInThePast } from './times.js'
import { createLogRecord } from './logs.js'

export const getById = id => browser.bookmarks.get(id).then(first)

export const search = browser.bookmarks.search.bind(browser.bookmarks)

export async function updateCapsuleData ({ bookmarkData, newFrequency, repeat, nextVisit, newUrl, newTitle }) {
  // NB: bookmarkData can be an archived bookmark, which will miss title metadata
  const { id, url, title, frequency, referenceDate } = bookmarkData
  const oldFrequency = frequency
  const oldUrl = url
  if (repeat == null) {
    if (bookmarkData.repeat != null) {
      repeat = bookmarkData.repeat
    } else {
      const defaultRepeats = await getSettingValue('settings:defaultRepeats')
      repeat = defaultRepeats
    }
  }
  const updatedTitle = formatBookmarkTitle({
    title: newTitle || title,
    frequency: newFrequency !== undefined ? newFrequency : frequency,
    referenceDate: nextVisit || referenceDate || Date.now(),
    nextVisit,
    repeat,
    updating: true,
  })
  const updateData = { title: updatedTitle }
  if (newUrl) updateData.url = newUrl
  const bookmark = await browser.bookmarks.update(id, updateData)
  if (newFrequency !== undefined || newUrl) {
    const changes = {}
    if (newFrequency !== undefined) changes.frequency = { old: oldFrequency, new: newFrequency }
    if (newUrl) changes.url = { old: oldUrl, new: newUrl }
    await createLogRecord({ event: 'updated-bookmark', bookmark, changes })
  }
  await ensureBookmarkFolderIsManagedFolder(bookmark)
  return serializeBookmark(bookmark)
}

export async function removeOrArchiveBookmark (bookmark) {
  const keepExpiredCapsulesAsNormalBookmarks = await getSettingValue('settings:keepExpiredCapsulesAsNormalBookmarks')
  if (keepExpiredCapsulesAsNormalBookmarks) {
    await archiveBookmark(bookmark)
  } else {
    await removeBookmark(bookmark)
  }
}

export async function removeBookmark (bookmark) {
  await browser.bookmarks.remove(bookmark.id)
  await createLogRecord({ event: 'removed-bookmark', bookmark })
}

export async function archiveBookmark (bookmark) {
  await browser.bookmarks.move(bookmark.id, { parentId: archiveFolderId })
  // Update after having changed folder, to avoid triggering event listeners
  // with an unformated bookmark
  await browser.bookmarks.update(bookmark.id, { title: bookmark.cleanedTitle })
  await createLogRecord({ event: 'archived-bookmark', bookmark })
}

// The initBookmarksFolders function needs to be called only once, given that even if the bookmark
// folder gets deleted, the folder id remains valid: newly created bookmarks
// will trigger the folder to be re-created

export let folderId
export let folder
export let archiveFolder
export let archiveFolderId

export const waitForFolders = initBookmarksFolders()
  .then(folders => {
    folder = folders.mainFolder
    folderId = folders.mainFolder.id
    archiveFolder = folders.archiveFolder
    archiveFolderId = folders.archiveFolder.id
  })
  .catch(console.error)

export async function addCapsule ({ url, title, frequency, repeat, nextVisit }) {
  const defaultRepeats = await getSettingValue('settings:defaultRepeats')
  if (frequency === undefined && (repeat !== 0 || nextVisit == null)) {
    throw new Error('a frequency or a next visit date is required')
  }
  return createBookmark({
    url,
    title: formatBookmarkTitle({
      title,
      frequency,
      nextVisit,
      repeat: repeat != null ? repeat : defaultRepeats,
    })
  })
}

export async function recover (deletedBookmark) {
  return createBookmark({
    url: deletedBookmark.url,
    title: deletedBookmark.title
  })
}

async function createBookmark ({ url, title }) {
  await waitForFolders
  const bookmark = await browser.bookmarks.create({
    parentId: folderId,
    url,
    title,
  })
  await createLogRecord({ event: 'created-bookmark', bookmark })
  return bookmark
}

export function isInFolder (bookmarkData) {
  if (folderId == null) throw new Error('folder id is not defined yet')
  return bookmarkData && bookmarkData.parentId === folderId
}

function isInArchiveFolder (bookmarkData) {
  if (folderId == null) throw new Error('folder id is not defined yet')
  return bookmarkData && bookmarkData.parentId === archiveFolderId
}

export async function getBookmarksByUrl (url) {
  if (!url) throw new Error('url is missing')
  // Filter-out URLs such as 'about:*' and 'file:*'
  // See https://bugzilla.mozilla.org/show_bug.cgi?id=1352835
  if (!url.startsWith('http')) return {}
  await waitForFolders
  const res = await browser.bookmarks.search({ url })
  const [ capsulesBookmarks, others ] = partition(res, isInFolder)
  const archivedBookmarks = others.filter(isInArchiveFolder)
  return {
    capsulesBookmark: capsulesBookmarks[0],
    archivedBookmark: archivedBookmarks[0],
  }
}

export async function getCapsuleBookmarkByUrl (url) {
  const { capsulesBookmark } = await getBookmarksByUrl(url)
  if (capsulesBookmark) return serializeBookmark(capsulesBookmark)
}

async function ensureBookmarkFolderIsManagedFolder (bookmark) {
  await waitForFolders
  if (bookmark.parent !== folderId) {
    console.log('moving bookmark to managed folder', bookmark)
    return browser.bookmarks.move(bookmark.id, { parentId: folderId })
  }
}

export async function getBookmarks () {
  await waitForFolders
  const [ { children: bookmarks } ] = await browser.bookmarks.getSubTree(folderId)
  return bookmarks.map(serializeBookmark)
}

export async function getTodaysBookmarksData () {
  const bookmarks = await getBookmarks()
  return bookmarks.filter(nextVisitIsToday)
}

export async function getBookmarksByIds (ids) {
  const bookmarks = await browser.bookmarks.get(ids)
  return bookmarks.map(serializeBookmark)
}

export async function getBookmarkById (id) {
  const [ bookmark ] = await getBookmarksByIds(id)
  return bookmark
}

export const nextVisitIsToday = bookmark => bookmark?.nextVisit < getLocalDayEndTime()

export const nextVisitIsInThePast = bookmark => timeIsInThePast(bookmark.nextVisit)

export async function archiveById (id) {
  await waitForFolders
  return browser.bookmarks.move(id, { parentId: archiveFolderId })
}

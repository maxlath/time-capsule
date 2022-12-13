import { first } from './utils.js'
import { initBookmarksFolders } from './bookmarks_init.js'
import { formatBookmarkTitle, serializeBookmark } from './bookmark_title.js'
import { getSettingValue } from './settings_store.js'
import { get as getDayEnd } from './day_end.js'
import { timeIsInThePast } from './times.js'
import { createLogRecord } from './logs.js'

export const getById = id => browser.bookmarks.get(id).then(first)

export const search = browser.bookmarks.search.bind(browser.bookmarks)

export async function updateCapsuleData ({ bookmarkData, newFrequency, repeat, nextVisit, newUrl, newTitle }) {
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
    frequency: newFrequency != null ? newFrequency : frequency,
    referenceDate: nextVisit || referenceDate || Date.now(),
    nextVisit,
    repeat,
    updating: true,
  })
  const updateData = { title: updatedTitle }
  if (newUrl) updateData.url = newUrl
  const bookmark = await browser.bookmarks.update(id, updateData)
  if (newFrequency || newUrl) {
    const changes = {}
    if (newFrequency) changes.frequency = { old: oldFrequency, new: newFrequency }
    if (newUrl) changes.url = { old: oldUrl, new: newUrl }
    await createLogRecord({ event: 'updated-bookmark', bookmark, changes })
  }
  await ensureBookmarkFolderIsManagedFolder(bookmark)
  return serializeBookmark(bookmark)
}

export async function removeBookmark (bookmark) {
  await browser.bookmarks.remove(bookmark.id)
  await createLogRecord({ event: 'removed-bookmark', bookmark })
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

export async function add (url, title, frequency) {
  const defaultRepeats = await getSettingValue('settings:defaultRepeats')
  return createBookmark({
    url,
    title: formatBookmarkTitle({
      title,
      frequency,
      referenceDate: Date.now(),
      repeat: defaultRepeats,
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

// functions that depend on the bookmark folder id availability
// but need to be directly defined/accessible on the API object
export async function getByUrl (url) {
  if (!url) throw new Error('url is missing')
  // Filter-out URLs such as 'about:*' and 'file:*'
  // See https://bugzilla.mozilla.org/show_bug.cgi?id=1352835
  if (!url.startsWith('http')) return
  await waitForFolders
  const res = await browser.bookmarks.search({ url })
  return res.filter(isInFolder)[0]
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

export const nextVisitIsToday = bookmark => bookmark?.nextVisit < getDayEnd()

export const nextVisitIsInThePast = bookmark => timeIsInThePast(bookmark.nextVisit)

export async function archiveById (id) {
  await waitForFolders
  return browser.bookmarks.move(id, { parentId: archiveFolderId })
}

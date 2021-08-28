import { first } from './utils'
import init from './bookmarks_init'
import bookmarkTitle from './bookmark_title'
import nextVisitIsToday from './next_visit_is_today'

export const getById = id => browser.bookmarks.get(id).then(first)

export const search = browser.bookmarks.search.bind(browser.bookmarks)

export async function updateTitle (id, title, frequency) {
  title = bookmarkTitle.format(title, frequency, true)
  const bookmark = await browser.bookmarks.update(id, { title })
  await ensureBookmarkFolderIsManagedFolder(bookmark)
  return bookmark
}

export const removeById = browser.bookmarks.remove.bind(browser.bookmarks)

export const parse = bookmarkData => {
  const data = bookmarkTitle.parse(bookmarkData.title) || {}
  return Object.assign(data, bookmarkData)
}

// The init function needs to be called only once, given that even if the bookmark
// folder gets deleted, the folder id remains valid: newly created bookmarks
// will trigger the folder to be re-created

export let folderId
export let folder

// store the promise
export const waitForFolder = init().then(f => {
  folder = f
  folderId = folder.id
})

export async function add (url, title, frequency) {
  await waitForFolder
  return browser.bookmarks.create({
    parentId: folderId,
    url,
    title: bookmarkTitle.format(title, frequency)
  })
}

export async function isInFolder (bookmarkData) {
  await waitForFolder
  return bookmarkData && bookmarkData.parentId === folderId
}

// functions that depend on the bookmark folder id availability
// but need to be directly defined/accessible on the API object
export async function getByUrl (url) {
  if (!url) throw new Error('url is missing')
  // Filter-out URLs such as 'about:*' and 'file:*'
  // See https://bugzilla.mozilla.org/show_bug.cgi?id=1352835
  if (!url.startsWith('http')) return
  await waitForFolder
  const res = await browser.bookmarks.search({ url })
  return res.filter(isInFolder)[0]
}

// Could possibly be extracted to become specific to background
// and not overload the popup
export async function getTodaysBookmarksData () {
  await waitForFolder
  return browser.bookmarks.getSubTree(folderId)
  .then(res => {
    if (!(res && res[0])) return []
    return res[0].children
    .map(parse)
    .filter(nextVisitIsToday)
  })
}

async function ensureBookmarkFolderIsManagedFolder (bookmark) {
  await waitForFolder
  if (bookmark.parent !== folderId) {
    console.log('moving bookmark to managed folder', bookmark)
    browser.bookmarks.move(bookmark.id, { parentId: folderId })
  }
}

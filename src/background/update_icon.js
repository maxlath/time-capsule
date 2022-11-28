import { enable, disable } from '../lib/icon.js'
import { getByUrl, isInFolder, parse } from '../lib/bookmarks.js'

export async function updateIcon (url) {
  const bookmarkData = await getByUrl(url)
  if (await isInFolder(bookmarkData)) {
    pageFound(bookmarkData)
  } else {
    pageDataNotFound()
  }
}

const pageFound = bookmarkData => {
  const parsedData = parse(bookmarkData)
  if (parsedData) enable(parsedData.frequency)
  // Known case: if the bookmark title was manually modified and made unparsable
  else disable()
}

const pageDataNotFound = () => disable()

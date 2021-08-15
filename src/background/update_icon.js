import { Error } from '../lib/utils'
import { enable, disable } from '../lib/icon'
import { getByUrl, isInFolder, parse } from '../lib/bookmarks'

export default url => {
  getByUrl(url)
  .then(parsePeriodicityData)
  .catch(Error('url change'))
}

const parsePeriodicityData = async bookmarkData => {
  if (await isInFolder(bookmarkData)) pageFound(bookmarkData)
  else pageDataNotFound()
}

const pageFound = bookmarkData => {
  const parsedData = parse(bookmarkData)
  if (parsedData) enable(parsedData.frequency)
  // Known case: if the bookmark title was manually modified and made unparsable
  else disable()
}

const pageDataNotFound = () => disable()

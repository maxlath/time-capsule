import { ErrorRethrow } from '../lib/utils.js'

const folderName = 'Time Capsules [managed folder]'

export default function () {
  return browser.bookmarks.getTree()
  .then(findMatch)
  .then(createFolderIfMissing)
  .catch(ErrorRethrow('initFolder'))
}

const findMatch = array => {
  for (const node of array) {
    if (matchingNode(node)) {
      return node
    } else if (node.children) {
      const childreMatch = findMatch(node.children)
      if (childreMatch) return childreMatch
    }
  }

  return false
}

const matchingNode = node => node.title === folderName

const createFolderIfMissing = match => {
  if (match) {
    return match
  } else {
    return browser.bookmarks.create({ title: folderName })
    .then(newFolder => {
      console.log('added folder: ' + newFolder.title)
      return newFolder
    })
  }
}

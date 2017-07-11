const promisify = require('./promisify_chrome')
const getTree = promisify(chrome.bookmarks.getTree, chrome.bookmarks)
const _ = require('../lib/utils')
const create = chrome.bookmarks.createAsync
const folderName = 'Time Capsules [managed folder]'

module.exports = function () {
  return getTree()
  .then(findMatch)
  .then(createFolderIfMissing)
  .catch(_.ErrorRethrow('initFolder'))
}

const findMatch = array => {
  for (let node of array) {
    if (matchingNode(node)) {
      return node
    } else if (node.children) {
      let childreMatch = findMatch(node.children)
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
    return create({ title: folderName })
    .then(newFolder => {
      console.log('added folder: ' + newFolder.title)
      return newFolder
    })
  }
}

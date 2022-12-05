const folderName = 'Time Capsules [managed folder]'
const archiveFolderName = 'Time Capsules [Archive][managed folder]'

export async function initBookmarksFolders () {
  const nodes = await browser.bookmarks.getTree()
  const mainFolder = findMatch(nodes, folderName) || await createFolder(folderName)
  const archiveFolder = findMatch(nodes, archiveFolderName) || await createFolder(archiveFolderName)
  return {
    mainFolder,
    archiveFolder,
  }
}

const findMatch = (array, folderTitle) => {
  for (const node of array) {
    if (node.title === folderTitle) {
      return node
    } else if (node.children) {
      const childrenMatch = findMatch(node.children, folderTitle)
      if (childrenMatch) return childrenMatch
    }
  }
}

const createFolder = async folderTitle => {
  const newFolder = await browser.bookmarks.create({ title: folderTitle })
  console.log('created folder: ' + newFolder.title, newFolder)
  return newFolder
}

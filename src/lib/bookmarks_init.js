const folderTag = '[managed folder]'
const folderName = `Time Capsules ${folderTag}`
const archiveFolderName = `Time Capsules [Archive]${folderTag}`

export async function initBookmarksFolders () {
  const nodes = await browser.bookmarks.search({ query: folderTag })
  const mainFolder = findMatch(nodes, folderName) || (await createFolder(folderName))
  const archiveFolder = findMatch(nodes, archiveFolderName) || (await createFolder(archiveFolderName))
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

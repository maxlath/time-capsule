import { getCapsuleBookmarkByUrl } from '../lib/bookmarks.js'
import { i18n } from '../lib/i18n.js'
import { isCapsulableUrl, range } from '../lib/utils.js'
import { allOptions } from '../popup/options.js'
import { saveCapsule } from '../lib/actions.js'
import { frequencyPattern } from '../popup/periodical_capsule_editor_helpers.js'
import { flashFailureIcon, flashSuccessIcon } from '../lib/icon.js'

const menuIdBase = 'time-capsule-menu'
// TODO: make configurable in settings
const extendedOptions = false

function initContextMenu ({ context, title }) {
  const menuId = `${menuIdBase}-${context}`
  browser.menus.create({
    id: menuId,
    contexts: [ context ],
    title,
    icons: {
      '16': 'icons/time-capsule-16.png',
      '32': 'icons/time-capsule-32.png',
    },
  })

  for (const [ category, { options, rangeMax, letter } ] of Object.entries(allOptions)) {
    const nums = extendedOptions ? range(1, rangeMax) : options
    if (nums) {
      const categoryMenuId = `${menuId}-${category}`
      browser.menus.create({
        id: categoryMenuId,
        parentId: menuId,
        contexts: [ context ],
        title: i18n(category),
      })
      for (const num of nums) {
        const frequency = `${num}${letter}`
        browser.menus.create({
          id: `${categoryMenuId}-${frequency}`,
          parentId: categoryMenuId,
          contexts: [ context ],
          title: num.toString(),
        })
      }
    }
  }
}

export function initContextMenus () {
  initContextMenu({ context: 'link', title: i18n('Bookmark_link_as_a_Time_Capsule') })
  initContextMenu({ context: 'image', title: i18n('Bookmark_image_as_a_Time_Capsule') })
  initContextMenu({ context: 'page', title: i18n('Bookmark_page_as_a_Time_Capsule') })
}

browser.menus?.onClicked.addListener(async info => {
  const { parentMenuItemId, menuItemId, linkText: title } = info
  const url = info.linkUrl || info.srcUrl || info.pageUrl
  if (!parentMenuItemId.startsWith(menuIdBase)) return
  const frequency = menuItemId.split('-').at(-1)
  if (!frequencyPattern.test(frequency)) return
  if (!isCapsulableUrl(url)) {
    console.log('url can not be used for a Time Capsule', url)
    await flashFailureIcon()
    return
  }
  const bookmark = await getCapsuleBookmarkByUrl(url)
  await saveCapsule({
    bookmark,
    url,
    frequency,
    title: bookmark?.title || title || url,
  })
  await flashSuccessIcon()
})

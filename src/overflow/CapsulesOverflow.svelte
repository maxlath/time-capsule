<script>
  import { getStillExistingBookmarks } from '../lib/bookmarks.js'
  import SettingsCogButton from '../popup/SettingsCogButton.svelte'
  import Capsules from '../settings/Capsules.svelte'
  import NavBar from '../settings/NavBar.svelte'
  import { getSettingValue } from '../lib/settings_store.js'
  import { i18n } from '../lib/i18n.js'

  const ids = new URLSearchParams(window.location.search).get('ids').split('|')

  const bookmarksPromise = getStillExistingBookmarks(ids)

  let bookmarksCount
  bookmarksPromise.then(bookmarks => bookmarksCount = bookmarks.length)

  let maxCapsules
  getSettingValue('settings:maxCapsules').then(value => maxCapsules = value)

  document.title = `Time Capsule - ${'Overflow'}`
</script>

<NavBar>
  <div slot="end">
    <SettingsCogButton />
  </div>
</NavBar>

<p>
  {#if bookmarksCount && maxCapsules != null}
    {@html i18n('overflow_explainer', [ bookmarksCount, maxCapsules ])}
  {/if}
</p>

<Capsules {bookmarksPromise} />

<style>
  p{
    margin: 1em;
    padding: 1em;
    background-color: var(--warning-color);
    border-radius: 3px;
  }
</style>

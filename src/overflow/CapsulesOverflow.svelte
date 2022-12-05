<script>
  import { getBookmarksByIds } from '../lib/bookmarks.js'
  import SettingsCogButton from '../popup/SettingsCogButton.svelte'
  import Capsules from '../settings/Capsules.svelte'
  import NavBar from '../settings/NavBar.svelte'
  import { getSettingValue } from '../lib/settings_store.js'

  const ids = new URLSearchParams(window.location.search).get('ids').split('|')

  const bookmarksPromise = getBookmarksByIds(ids)

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
  {#if bookmarksCount && maxCapsules}
    <strong>{bookmarksCount} Capsules</strong> are due to be open, which is more than the maximum ({maxCapsules}) set in your <a href="/settings/settings.html?tab=preferences" target="_blank">preferences</a>, so instead of opening {bookmarksCount} tabs, here is the list:
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

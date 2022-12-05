<script>
  import CapsuleEditor from './CapsuleEditor.svelte'
  import Spinner from './Spinner.svelte'
  import { getUrl, getCurrentUrlBookmarkData } from '../lib/tabs.js'
  import Flash from './Flash.svelte'
  import SettingsCogButton from './SettingsCogButton.svelte'

  let waitingForBookmarkData, currentUrl, bookmark, flash

  getUrl().then(url => currentUrl = url)

  waitingForBookmarkData = getCurrentUrlBookmarkData()
    .then(bookmarkData => bookmark = bookmarkData)
    .catch(err => flash = err)
</script>

<SettingsCogButton context="popup" />

{#await waitingForBookmarkData}
  <Spinner />
{:then}
  <CapsuleEditor
    bind:bookmark
    url={currentUrl}
    context="popup"
    on:done={() => window.close()}
    />
{/await}

<Flash state={flash} />

<style>
  :global(body){
    margin: 0 auto;
    padding: 2px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    min-width: 19em;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  :global(main){
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    position: relative;
    padding: 0.5em;
  }
</style>

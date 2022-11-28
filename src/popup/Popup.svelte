<script>
  import CapsuleEditor from './CapsuleEditor.svelte'
  import Spinner from './Spinner.svelte'
  import { getUrl, getCurrentUrlBookmarkData } from '../lib/tabs.js'
  import Flash from './Flash.svelte'

  let waitingForBookmarkData, currentUrl, bookmark, flash

  getUrl().then(url => currentUrl = url)

  waitingForBookmarkData = getCurrentUrlBookmarkData()
    .then(bookmarkData => bookmark = bookmarkData)
    .catch(err => flash = err)

  function showSettings () {
    browser.tabs.create({ url: '/settings/settings.html' })
    window.close()
  }
</script>

<button class="settings" on:click={showSettings} />

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
  :global(html){
    font-family: sans-serif;
    background-color: #f0f0f0;
    margin: 0;
  }

  :global(body){
    background-color: #f0f0f0;
    color: #222;
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
  }

  .settings{
    margin: 1em 1em 1em auto;
    border: 0;
    width: 1.6em;
    height: 1.6em;
    background-image: url('/icons/cog.svg');
    background-size: cover;
    background-position: center center;
  }
</style>

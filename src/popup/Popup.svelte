<script>
  import CapsuleEditor from './CapsuleEditor.svelte'
  import Spinner from './Spinner.svelte'
  import { getActiveTabBookmarkData } from '../lib/tabs.js'
  import Flash from './Flash.svelte'
  import SettingsCogButton from './SettingsCogButton.svelte'
  import PossiblyObsoleteCapsuleEditor from './PossiblyObsoleteCapsuleEditor.svelte'

  let activeTab, bookmark, possibleUpdate, flash

  const waitingForBookmarkData = getActiveTabBookmarkData()
    .then((res = {}) => {
      ;({ activeTab, bookmark, possibleUpdate } = res)
    })
    .catch(err => flash = err)
</script>

<SettingsCogButton context="popup" />

{#await waitingForBookmarkData}
  <Spinner />
{:then}
  {#if possibleUpdate}
    <PossiblyObsoleteCapsuleEditor {bookmark} {possibleUpdate} {activeTab} />
  {:else}
    <CapsuleEditor
      bind:bookmark
      url={activeTab.url}
      context="popup"
      on:done={() => window.close()}
      />
  {/if}
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

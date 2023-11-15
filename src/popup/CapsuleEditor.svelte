<script>
  import OneTimeCapsuleEditor from './OneTimeCapsuleEditor.svelte'
  import PeriodicalCapsuleEditor from './PeriodicalCapsuleEditor.svelte'
  import AdvancedCapsuleEditor from './AdvancedCapsuleEditor.svelte'
  import { i18n } from '../lib/i18n.js'
  import { createEventDispatcher } from 'svelte'
  import CapsuleEditorTabs from './CapsuleEditorTabs.svelte'
  import { getSettingStore, getSettingValue } from '../lib/settings_store.js'
  import { isCapsulableUrl, sleep } from '../lib/utils.js'
  import { archiveBookmark, removeBookmark } from '../lib/bookmarks.js'
  import Celebration from './Celebration.svelte'
  import ArchiveIcon from '../icons/ArchiveIcon.svelte'
  import TrashIcon from '../icons/TrashIcon.svelte'
  import Flash from './Flash.svelte'

  export let bookmark, url, activeTab = null, context = null

  const dispatch = createEventDispatcher()

  const selectedTab = getSettingStore('popup:selectedTab')

  let celebrationData, flash

  async function archive () {
    if (bookmark) {
      celebrationData = { action: 'archived' }
      await archiveBookmark(bookmark)
    }
    onEditorDone()
  }
  async function remove () {
    if (bookmark) {
      celebrationData = { action: 'removed' }
      await removeBookmark(bookmark)
    }
    onEditorDone()
  }

  function onKeydown (e) {
    const { key } = e
    if (key === 'Delete' && bookmark) remove()
    else if (key === 'a' && bookmark) archive()
    else if (key === 'o') $selectedTab = 'one-time'
    else if (key === 'p') $selectedTab = 'periodical'
    else if (key === 'v') $selectedTab = 'advanced'
  }

  let animationIsDone
  async function celebrate (e) {
    celebrationData = e.detail || {}
  }

  async function onEditorDone () {
    await animationIsDone
    if (activeTab && celebrationData.action === 'save') {
      const closeTabAfterCreatingCapsule = await getSettingValue('settings:closeTabAfterCreatingCapsule')
      if (closeTabAfterCreatingCapsule) await browser.tabs.remove(activeTab.id)
    }
    dispatch('done')
  }

  $: if (celebrationData) animationIsDone = sleep(500)
</script>

<svelte:window on:keydown={onKeydown} />

{#if context === 'settings'}
  <button
    class="close"
    on:click={() => dispatch('done')}
  >⨯</button>
{/if}

<Flash state={flash} />

{#if celebrationData}
  <Celebration {...celebrationData} />
{:else if isCapsulableUrl(url)}
  <CapsuleEditorTabs />
  {#if $selectedTab === 'one-time'}
    <OneTimeCapsuleEditor
      bind:bookmark
      {url}
      bind:flash
      on:celebrate={celebrate}
      on:done={onEditorDone}
    />
  {:else if $selectedTab === 'periodical'}
    <PeriodicalCapsuleEditor
      bind:bookmark
      {url}
      bind:flash
      on:celebrate={celebrate}
      on:done={onEditorDone}
    />
   {:else if $selectedTab === 'advanced'}
    <AdvancedCapsuleEditor
      bind:bookmark
      {url}
      {activeTab}
      bind:flash
      on:celebrate={celebrate}
      on:done={onEditorDone}
    />
  {/if}
  {#if bookmark}
    <div class="buttons">
      <button
        class="archive"
        title="Remove this Time Capsule, but keep the bookmark [{i18n('Hotkey')}: a]"
        on:click={archive}
        >
        <div class="icon-wrapper"><ArchiveIcon /></div>
        <span>{i18n('Archive')}</span>
      </button>
      <button
        class="delete"
        title="Delete both the Time Capsule and the bookmark [{i18n('Hotkey')}: {i18n('del_key')}]"
        on:click={remove}
        >
        <div class="icon-wrapper"><TrashIcon /></div>
        <span>{i18n('Delete')}</span>
      </button>
    </div>
  {/if}
{:else}
  <p class="invalid">{i18n('url_cant_be_time_capsuled')}</p>
{/if}

<style>
  .invalid{
    padding: 2em 1em;
    font-style: italic;
    color: var(--grey-666);
  }
  .close{
    line-height: 1.6rem;
    font-size: 2.5rem;
    padding: 0.2rem 0.2rem 0.6rem 0.2rem;
    font-weight: bold;
    position: absolute;
    top: 0;
    right: 0;
    color: var(--grey-666);
    transition: color 0.2s ease;
  }
  .close:hover{
    color: var(--grey-222);
  }
  .buttons{
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: center;
    gap: 1em;
    margin-top: 1em;
  }
  button{
    border-radius: 3px;
    padding: 0.5em 1em;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    gap: 0.5em;
  }
  .icon-wrapper{
    flex: 0 0 1em;
    height: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .archive{
    background-color: var(--warning-color);
  }
  .delete{
    background-color: var(--danger-color);
  }
</style>

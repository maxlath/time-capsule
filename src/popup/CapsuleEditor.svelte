<script>
  import OneTimeCapsuleEditor from './OneTimeCapsuleEditor.svelte'
  import PeriodicalCapsuleEditor from './PeriodicalCapsuleEditor.svelte'
  import AdvancedCapsuleEditor from './AdvancedCapsuleEditor.svelte'
  import { i18n } from '../lib/i18n.js'
  import { BubbleUpComponentEvent } from '../lib/svelte.js'
  import { createEventDispatcher } from 'svelte'
  import CapsuleEditorTabs from './CapsuleEditorTabs.svelte'
  import { getSettingStore } from '../lib/settings_store.js'
  import { isCapsulableUrl } from '../lib/utils.js'
  import { archiveBookmark, removeBookmark } from '../lib/bookmarks.js'

  export let bookmark, url, context = null

  const dispatch = createEventDispatcher()
  const bubbleUpComponentEvent = BubbleUpComponentEvent(dispatch)

  const selectedTab = getSettingStore('popup:selectedTab')

  async function archive () {
    await archiveBookmark(bookmark)
    dispatch('done')
  }
  async function remove () {
    await removeBookmark(bookmark)
    dispatch('done')
  }
</script>

{#if context === 'settings'}
  <button
    class="close"
    on:click={() => dispatch('done')}
  >⨯</button>
{/if}

{#if isCapsulableUrl(url)}
  <CapsuleEditorTabs />
  {#if $selectedTab === 'one-time'}
    <OneTimeCapsuleEditor
      bind:bookmark
      {url}
      {context}
      on:done={bubbleUpComponentEvent}
    />
  {:else if $selectedTab === 'periodical'}
    <PeriodicalCapsuleEditor
      bind:bookmark
      {url}
      {context}
      on:done={bubbleUpComponentEvent}
    />
   {:else if $selectedTab === 'advanced'}
    <AdvancedCapsuleEditor
      bind:bookmark
      {url}
      {context}
      on:done={bubbleUpComponentEvent}
    />
  {/if}
  {#if bookmark}
    <div class="buttons">
      <button
        class="archive"
        title="Remove this Time Capsule, but keep the bookmark [{i18n('Hotkey')}: a]"
        on:click={archive}
        >
        {i18n('Archive')}
      </button>
      <button
        class="delete"
        title="Delete both the Time Capsule and the bookmark [{i18n('Hotkey')}: {i18n('del_key')}]"
        on:click={remove}
        >
        {i18n('Delete')}
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
    line-height: 1.8rem;
    font-size: 2.5rem;
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
    align-items: center;
    justify-content: center;
    gap: 1em;
  }
  button{
    border-radius: 3px;
    padding: 0.5em;
  }
  .archive{
    background-color: var(--warning-color);
  }
  .delete{
    background-color: var(--danger-color);
  }
</style>

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

  export let bookmark, url, context = null

  const dispatch = createEventDispatcher()
  const bubbleUpComponentEvent = BubbleUpComponentEvent(dispatch)

  const selectedTab = getSettingStore('popup:selectedTab')
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
</style>

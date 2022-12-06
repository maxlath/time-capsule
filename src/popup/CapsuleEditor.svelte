<script>
  import FrequencySelector from './FrequencySelector.svelte'
  import OptionsSelectorAdvanced from './OptionsSelectorAdvanced.svelte'
  import { i18n } from '../lib/i18n.js'
  import { BubbleUpComponentEvent } from '../lib/svelte.js'
  import { createEventDispatcher } from 'svelte'
  import CapsuleEditorTabs from './CapsuleEditorTabs.svelte'
  import { getSettingStore } from '../lib/settings_store.js'

  export let bookmark, url, context = null

  const dispatch = createEventDispatcher()
  const bubbleUpComponentEvent = BubbleUpComponentEvent(dispatch)

  // Filter-out URLs such as (about|file|data):*
  // See https://bugzilla.mozilla.org/show_bug.cgi?id=1352835
  const isTimeCapsulableUrl = url && url.startsWith('http')

  const selectedTab = getSettingStore('popup:selectedTab')
</script>

{#if context === 'settings'}
  <button
    class="close"
    on:click={() => dispatch('done')}
  >⨯</button>
{/if}

{#if isTimeCapsulableUrl}
  <CapsuleEditorTabs />
  {#if $selectedTab === 'simple'}
    <FrequencySelector
      bind:bookmark
      {url}
      {context}
      on:done={bubbleUpComponentEvent}
    />
   {:else if $selectedTab === 'advanced'}
    <OptionsSelectorAdvanced
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

<script>
  import OptionsSelector from './OptionsSelector.svelte'
  import { setFrequency } from '../lib/actions.js'
  import { i18n } from '../lib/i18n.js'
  import { onChange } from '../lib/svelte.js'
  import { createEventDispatcher } from 'svelte'
  import { sleep } from '../lib/utils.js'
  import TrashBinIcon from './TrashBinIcon.svelte'

  export let bookmark, url, context = null

  const dispatch = createEventDispatcher()

  let nextVisit, selectedFrequency, newBookmark

  if (bookmark) {
    nextVisit = new Date(bookmark.nextVisit).toLocaleString()
    selectedFrequency = bookmark.frequency
  }

  // Filter-out URLs such as 'about:*' and 'file:*'
  // See https://bugzilla.mozilla.org/show_bug.cgi?id=1352835
  const isTimeCapsulableUrl = url && url.startsWith('http')

  let celebratedNewFrequency, animationIsDone
  async function onSelectedFrequencyChange () {
    if (selectedFrequency !== bookmark?.frequency) {
      celebratedNewFrequency = selectedFrequency
      // Wait a bit to let the frequency to be saved and show the success animation
      animationIsDone = sleep(500)
      newBookmark = await setFrequency({ url, frequency: selectedFrequency, context })
      bookmark = bookmark ? Object.assign(bookmark, newBookmark) : newBookmark
      await animationIsDone
      dispatch('done')
    }
  }

  $: onChange(selectedFrequency, onSelectedFrequencyChange)
</script>

{#if celebratedNewFrequency}
  <div class="celebration-wrapper">
    {#if celebratedNewFrequency === 'never'}
      <p class="never"><TrashBinIcon /></p>
    {:else}
      <p>{celebratedNewFrequency}</p>
    {/if}
  </div>
{:else}
  {#if context === 'settings'}
    <button
      class="close"
      on:click={() => dispatch('done')}
    >⨯</button>
  {/if}

  {#if nextVisit}
    <div class="next-visit">
      <h2>{i18n('next_visit')}</h2>
      <p>{nextVisit}</p>
    </div>
  {/if}

  {#if isTimeCapsulableUrl}
    <OptionsSelector bind:selectedFrequency />
  {:else}
    <p class="invalid">{i18n('url_cant_be_time_capsuled')}</p>
  {/if}
{/if}

<style>
  h2{
    text-align: center;
    font-size: 1rem;
    margin-bottom: 0;
  }

  .next-visit p{
    text-align: center;
  }

  .invalid{
    padding: 1em;
    font-style: italic;
    color: #666;
  }

  .close{
    line-height: 1.8rem;
    font-size: 2.5rem;
    font-weight: bold;
    position: absolute;
    top: 0;
    right: 0;
    color: #666;
    transition: color 0.2s ease;
  }
  .close:hover{
    color: #222;
  }

  .celebration-wrapper{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 15em;
  }
  .celebration-wrapper p{
    font-size: 3em;
    font-weight: bold;
    color: var(--success-color);
    animation-name: grow-out-text;
    animation-duration: 0.5s;
  }
  .celebration-wrapper p.never{
    color: var(--danger-color);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 2em;
    width: 2em;
    animation-name: grow-out-svg;
    animation-duration: 0.5s;
  }
  @keyframes grow-out-text{
    to {
      font-size: 6em;
      opacity: 0;
    }
  }
  @keyframes grow-out-svg{
    to {
      height: 4em;
      width: 4em;
      opacity: 0;
    }
  }
</style>

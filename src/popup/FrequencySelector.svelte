<script>
  import PeriodicityOptions from './PeriodicityOptions.svelte'
  import TypingHelp from './TypingHelp.svelte'
  import { createEventDispatcher } from 'svelte'
  import { onChange } from '../lib/svelte.js'
  import { getMatchingPart, findFrequencyPattern, isKeyboardSelectorKey } from '../lib/frequency_selector_helpers.js'
  import { setFrequency } from '../lib/actions.js'
  import { sleep } from '../lib/utils.js'

  export let bookmark, url, context

  const dispatch = createEventDispatcher()

  let showKeyboardSelector = false
  let foundFrequency, selectedFrequency, newBookmark

  if (bookmark) {
    selectedFrequency = bookmark.frequency
  }

  function onKeydown ({ key }) {
    if (isKeyboardSelectorKey(key)) {
      showKeyboardSelector = true
      // Keep only the last 4 keys
      lastKeys = lastKeys.slice(-3) + key
      foundFrequency = findFrequencyPattern(lastKeys)
      if (foundFrequency) {
        selectedFrequency = foundFrequency
      }
    } else if (key === 'Backspace') {
      lastKeys = lastKeys.slice(0, -1)
    }
  }

  let lastKeys = ''
  let matchingPart

  $: matchingPart = getMatchingPart(lastKeys)

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

<svelte:window on:keydown={onKeydown}/>

{#if celebratedNewFrequency}
  <div class="celebration-wrapper">
    {#if celebratedNewFrequency === 'never'}
      <p class="never">
        <img src="/icons/red-trash-bin.svg" alt="delete icon" />
      </p>
    {:else}
      <p>{celebratedNewFrequency}</p>
    {/if}
  </div>
{:else}
  <div>
    {#if showKeyboardSelector}
      <div class="typing-view">
        <p class="typing" class:success={foundFrequency}>{matchingPart}</p>
        <TypingHelp />
      </div>
    {:else}
      <PeriodicityOptions bind:selectedFrequency />
    {/if}
  </div>
{/if}

<style>
  .typing-view{
    width: 18em;
    height: 16em;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .typing{
    margin: auto;
    font-size: 3em;
    text-align: center;
  }

  .typing.success{
    font-weight: bold;
    color: var(--success-color);
    animation-name: grow-out-text;
    animation-duration: 0.5s;
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

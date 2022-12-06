<script>
  import PeriodicityOptions from './PeriodicityOptions.svelte'
  import TypingHelp from './TypingHelp.svelte'
  import { createEventDispatcher } from 'svelte'
  import { BubbleUpComponentEvent } from '../lib/svelte.js'
  import { getMatchingPart, findFrequencyPattern, isKeyboardSelectorKey } from '../lib/frequency_selector_helpers.js'

  export let selectedFrequency

  const dispatch = createEventDispatcher()
  const bubbleUpComponentEvent = BubbleUpComponentEvent(dispatch)

  let showKeyboardSelector = false
  let foundFrequency

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
</script>

<svelte:window on:keydown={onKeydown}/>

<div>
  {#if showKeyboardSelector}
    <div class="typing-view">
      <p class="typing" class:success={foundFrequency}>{matchingPart}</p>
      <TypingHelp />
    </div>
  {:else}
    <PeriodicityOptions bind:selectedFrequency on:done={bubbleUpComponentEvent} />
  {/if}
</div>

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
    animation-name: grow-out;
    animation-duration: 0.5s;
  }

  @keyframes grow-out {
    to {
      font-size: 6em;
      opacity: 0;
    }
  }
</style>

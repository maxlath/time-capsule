<script>
  import PeriodicityOptions from './PeriodicityOptions.svelte'
  import TypingHelp from './TypingHelp.svelte'
  import { createEventDispatcher } from 'svelte'
  import { getMatchingPart, findFrequencyPattern, isKeyboardSelectorKey } from './periodical_capsule_editor_helpers.js'
  import { saveCapsule } from '../lib/actions.js'
  import { getCapsuleBookmarkByUrl } from '../lib/bookmarks.js'

  export let bookmark, url, context, flash

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

  async function onDone () {
    try {
      if (selectedFrequency !== bookmark?.frequency) {
        dispatch('celebrate', { frequency: selectedFrequency })
        newBookmark = await saveCapsule({
          bookmark: await getCapsuleBookmarkByUrl(url),
          url,
          frequency: selectedFrequency,
          context
        })
        bookmark = bookmark ? Object.assign(bookmark, newBookmark) : newBookmark
        dispatch('done')
      } else {
        dispatch('done')
      }
    } catch (err) {
      flash = err
    }
  }
</script>

<svelte:window on:keydown={onKeydown} />

<div class="peridical-capsule-editor">
  {#if showKeyboardSelector}
    <div class="typing-view">
      <p class="typing" class:success={foundFrequency}>{matchingPart}</p>
      <TypingHelp />
    </div>
  {:else}
    <PeriodicityOptions
      bind:selectedFrequency
      on:done={onDone}
    />
  {/if}
</div>

<style>
  .peridical-capsule-editor{
    min-width: 18em;
    min-height: 16em;
  }
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
</style>

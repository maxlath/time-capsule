<script>
  import PeriodicityOptions from './PeriodicityOptions.svelte'
  import TypingHelp from './TypingHelp.svelte'

  export let selectedFrequency

  const isKeyboardSelectorKey = key => /^[\d.HDWMYT]{1}$/.test(key)

  let showKeyboardSelector = false
  let foundFrequency

  function onKeydown ({ key }) {
    if (isKeyboardSelectorKey(key)) {
      showKeyboardSelector = true
      foundFrequency = matchFrequencyPattern(key)
      if (foundFrequency) {
        selectedFrequency = foundFrequency
        done()
      }
    } else if (key === 'Backspace') {
      lastKeys = lastKeys.slice(0, -1)
    }
  }

  // leading figure can't be 0
  const frequencyPattern = /^[^\d.]?([1-9][\d.]{0,2})([HDWMYT])$/i
  const frequencyStartPattern = /([1-9][\d.]{0,2})([HDWMYT])?$/i

  let lastKeys = ''
  let matchingPart

  function matchFrequencyPattern (key) {
    // Keep only the last 4 keys
    lastKeys = lastKeys.slice(-3) + key
    const match = lastKeys.match(frequencyPattern)
    if (match) {
      let [ , num, unit ] = match
      // prevent to pass sequences like 000
      num = parseFloat(num).toString()
      unit = unit.toUpperCase()
      return `${num}${unit}`
    }
  }

  function getMatchingPart (str) {
    const match = str.match(frequencyStartPattern)
    return match ? match[0] : ''
  }

  function done () {
    // Wait a bit to let the frequency to be saved and show the success animation
    setTimeout(window.close.bind(window), 500)
  }

  $: matchingPart = getMatchingPart(lastKeys)
</script>

<svelte:window on:keydown={onKeydown}/>

<div id="optionsView">
  {#if showKeyboardSelector}
    <div id="typingView">
      <p id="typing" class:success={foundFrequency}>{matchingPart}</p>
      <TypingHelp />
    </div>
  {:else}
    <PeriodicityOptions bind:selectedFrequency />
  {/if}
</div>

<style>
  #typingView{
    width: 18em;
    height: 16em;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  #typing{
    margin: auto;
    font-size: 3em;
    text-align: center;
  }

  #typing.success{
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

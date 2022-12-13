<script>
  import { inMenu as categories } from './options.js'
  import { i18n } from '../lib/i18n.js'
  import { createEventDispatcher, onMount } from 'svelte'
  import { getNextVisit } from '../lib/bookmark_title.js'
  import { slide } from 'svelte/transition'
  import { parseFrequency } from '../lib/frequency.js'

  export let selectedFrequency

  const dispatch = createEventDispatcher()

  let highlightedFrequency = selectedFrequency || '1M'

  const categoriesList = Object.values(categories)
  const categoriesLetters = categoriesList.map(category => category.letter)
  const categoriesByLetter = categoriesList.reduce((index, category) => {
    index[category.letter] = category
    return index
  }, {})

  let selectedFrequencyIsCustom
  if (selectedFrequency) {
    const selectedFrequencyNumber = parseInt(selectedFrequency.slice(0, -1))
    const selectedFrequencyLetter = selectedFrequency.slice(-1)[0]
    const selectedCategory = categoriesByLetter[selectedFrequencyLetter]
    selectedFrequencyIsCustom = selectedCategory == null || !selectedCategory.options.includes(selectedFrequencyNumber)
  }

  const optionsElements = {}

  function onKeydown (e) {
    const { key } = e

    // Let the Tab key bubble up
    if (key === 'Tab') return

    const currentFrequencyNumber = parseInt(highlightedFrequency.slice(0, -1))
    const currentFrequencyLetter = highlightedFrequency.slice(-1)[0]
    const currentCategory = categoriesByLetter[currentFrequencyLetter]
    const lineNumber = categoriesLetters.indexOf(currentFrequencyLetter)
    let columnNumber = currentCategory?.options.indexOf(currentFrequencyNumber)
    if (columnNumber == null || columnNumber < 0) columnNumber = 0
    if (key === 'ArrowLeft') {
      const { options } = currentCategory
      const number = options.at((columnNumber - 1) % options.length)
      highlightedFrequency = `${number}${currentFrequencyLetter}`
    } else if (key === 'ArrowRight') {
      const { options } = currentCategory
      const number = options.at((columnNumber + 1) % options.length)
      highlightedFrequency = `${number}${currentFrequencyLetter}`
    } else if (key === 'ArrowUp') {
      const category = categoriesList.at((lineNumber - 1) % categoriesList.length)
      const number = category.options[columnNumber]
      highlightedFrequency = `${number}${category.letter}`
    } else if (key === 'ArrowDown') {
      const category = categoriesList.at((lineNumber + 1) % categoriesList.length)
      const number = category.options[columnNumber]
      highlightedFrequency = `${number}${category.letter}`
    } else if (key === 'Enter') {
      if (Array.from(e.target.classList).includes('option')) {
        selectedFrequency = highlightedFrequency
        dispatch('done')
      } else {
        // Let the event bubble to trigger buttons
        return
      }
    } else if (key === 'Delete') {
      remove()
    }

    e.stopPropagation()
    e.preventDefault()
  }

  function select (frequency) {
    highlightedFrequency = selectedFrequency = frequency
    dispatch('done')
  }

  function remove () {
    selectedFrequency = 'never'
    dispatch('done')
  }

  onMount(() => {
    optionsElements[highlightedFrequency]?.focus()
  })

  $: optionsElements[highlightedFrequency]?.focus()

  let frequencyNum, frequencyUnitLabel
  $: {
    ;({ num: frequencyNum, unitLabel: frequencyUnitLabel } = parseFrequency(highlightedFrequency))
  }

  let nextVisit
  $: {
    nextVisit = getNextVisit({ frequency: highlightedFrequency, referenceDate: Date.now() })
  }
</script>

<svelte:window on:keydown={onKeydown}/>

{#if frequencyUnitLabel}
  <h2>{i18n('browse_every_time_unit', [ frequencyNum.toString(), i18n(frequencyUnitLabel) ])}</h2>
{/if}

<div class="periodic-options">
  {#each Object.entries(categories) as [ category, { optionsData } ] }
    <h3 class="category-header">{i18n(category)}</h3>
    <ul>
      {#each optionsData as { num, unit, frequency, frequencyLabel, color, bgColor }}
        <li>
          <button
            class="option"
            bind:this={optionsElements[frequency]}
            title="Set the frequency to {frequencyLabel} [{i18n('Hotkey')}: {num}{unit}]"
            style:color={color}
            style:background-color={bgColor}
            on:focus={() => highlightedFrequency = frequency}
            on:click={() => select(frequency)}
          >
            {num}
          </button>
        </li>
      {/each}
    </ul>
  {/each}

  <div class="special-options">
    {#if selectedFrequencyIsCustom}
      <button
        class="custom"
        on:focus={() => highlightedFrequency = selectedFrequency}
        on:click={window.close.bind(window)}
        >
        {i18n('custom')}: {selectedFrequency}
      </button>
    {/if}
  </div>
</div>

{#if nextVisit}
  <div transition:slide|local={{ duration: 200 }}>
    <h2>{i18n('next_visit')}</h2>
    <p class="next-visit">{nextVisit.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
  </div>
{/if}

<style>
  .periodic-options{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .category-header{
    font-size: 1.1em;
    text-align: center;
  }
  h2{
    font-size: 1.2rem;
    text-align: center;
    margin: 0;
  }
  h3{
    margin-top: 0.8em;
    margin-bottom: 0;
  }
  ul{
    margin: 0 auto;
    width: 17em;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
  button{
    border: 0;
  }
  .option, .custom{
    transition: all 0.3s;
    border-radius: 1px;
    text-align: center;
  }
 .custom{
    padding: 0.5em 1em 0.5em 1em;
    margin: 0.2em;
  }
  .option{
    font-size: 1em;
    padding: 0.2em 0 0.2em 0;
    width: 2.5em;
    margin: 0.2em 0 0.2em 0;
    text-align: center;
  }
  .option:focus, .option:hover{
    /* Override inline color and background-color */
    color: white !important;
    background-color: var(--light-blue) !important;
  }
  .special-options{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    align-self: stretch;
  }
  .special-options button{
    font-weight: bold;
    color: white;
    flex: 1 0 0;
    max-width: 50%;
    margin-top: 1em;
    margin-bottom: 1em;
  }
  .special-options button:not(:first-child){
    margin-left: 0.5em;
  }
  .special-options button:not(:last-child){
    margin-right: 0.5em;
  }
  .custom{
    background-color: var(--light-blue) !important;
  }
  .custom:hover{
    background-color: var(--darker-light-blue) !important;
  }
  .next-visit{
    text-align: center;
  }
</style>

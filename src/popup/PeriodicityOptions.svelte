<script>
  import { inMenu as categories } from './options'
  import { i18n } from '../lib/i18n'
  import { createEventDispatcher } from 'svelte'

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

  function onKeydown (e) {
    const { key } = e
    const currentFrequencyNumber = parseInt(highlightedFrequency.slice(0, -1))
    const currentFrequencyLetter = highlightedFrequency.slice(-1)[0]
    const currentCategory = categoriesByLetter[currentFrequencyLetter]
    const lineNumber = categoriesLetters.indexOf(currentFrequencyLetter)
    let columnNumber = currentCategory?.options.indexOf(currentFrequencyNumber)
    if (columnNumber < 0) columnNumber = 0
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
      selectedFrequency = highlightedFrequency
      dispatch('done')
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
</script>

<svelte:window on:keydown={onKeydown}/>

<div class="periodic-options">
  {#each Object.entries(categories) as [ category, { optionsData } ] }
    <h3 class="category-header">{i18n(category)}</h3>
    <ul>
      {#each optionsData as { num, frequency, color, bgColor }}
        <li>
          <button
            class="option"
            class:highlight={frequency === highlightedFrequency}
            style:color={color}
            style:background-color={bgColor}
            on:click={() => select(frequency)}
          >
            {num}
          </button>
        </li>
      {/each}
    </ul>
  {/each}

  {#if selectedFrequencyIsCustom}
    <button
      class="custom highlight"
      on:click={window.close.bind(window)}
      >
      {i18n('custom')}: {selectedFrequency}
    </button>
  {/if}

  <button
    class="never"
    title="[Delete]"
    on:click={remove}
    >
    {i18n('never')}
  </button>
</div>

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
  .option, .never, .custom{
    cursor: pointer;
    transition: all 0.3s;
    border-radius: 1px;
    text-align: center;
  }
  .never, .custom{
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
  .highlight, .option:hover{
    /* Override inline color and background-color */
    color: white !important;
    background-color: var(--light-blue) !important;
  }
  .never, .custom{
    font-weight: bold;
    color: white;
    /* Larger to give the room to the French 'Personnalisé' translation */
    /* and anticipating for the future German translation ;) */
    width: 8em;
    margin: 1em auto;
  }
  .custom:hover{
    background-color: var(--darker-light-blue) !important;
  }
  .never{
    background-color: #e88;
  }
  .never:hover{
    background-color: #c55;
  }
</style>

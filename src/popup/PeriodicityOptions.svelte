<script>
  import { inMenu as categories } from '../js/popup/options'
  import { i18n } from '../lib/i18n'

  export let selectedFrequency

  let highlightedFrequency = selectedFrequency || '1M'
  const categoriesList = Object.values(categories)
  const categoriesLetters = categoriesList.map(category => category.letter)
  const categoriesByLetter = categoriesList.reduce((index, category) => {
    index[category.letter] = category
    return index
  }, {})

  function onKeydown ({ key }) {
    const currentFrequencyNumber = parseInt(highlightedFrequency.slice(0, -1))
    const currentFrequencyLetter = highlightedFrequency.slice(-1)[0]
    const currentCategory = categoriesByLetter[currentFrequencyLetter]
    const lineNumber = categoriesLetters.indexOf(currentFrequencyLetter)
    const columnNumber = currentCategory.options.indexOf(currentFrequencyNumber)
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
      done()
    } else if (key === 'Delete') {
      remove()
    }
  }

  function onSelect (e) {
    highlightedFrequency = selectedFrequency = e.target.dataset.frequency
    done()
  }

  function remove () {
    selectedFrequency = 'never'
    done()
  }

  function done () {
    // Wait a bit to let the frequency to be saved
    setTimeout(window.close.bind(window), 200)
  }

</script>

<svelte:window on:keydown={onKeydown}/>

<div id="periodicOptions">
  {#each Object.entries(categories) as [ category, { optionsData } ] }
    <h3 class="category-header">{i18n(category)}</h3>
    <ul>
      {#each optionsData as { num, frequency, color, bgColor }}
        <li>
          <button
            class="option frequency-{frequency}"
            class:highlight={frequency === highlightedFrequency}
            style="color: {color}; background-color: {bgColor};"
            data-frequency={frequency}
            on:click={onSelect}
          >
            {num}
          </button>
        </li>
      {/each}
    </ul>
  {/each}

  <button
    class="never"
    title="[Delete]"
    on:click={remove}
    >
    {i18n('never')}
  </button>
</div>

<style>
  #periodicOptions{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .category{
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    text-align: center;
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
  }

  .never, .custom{
    /* Larger to give the room to the French 'Personnalisé' translation */
    /* and anticipating for the future German translation ;) */
    width: 8em;
    margin: 1em auto;
  }
  .never{
    background-color: #e88;
  }
  .never:hover{
    background-color: #c55;
  }
  .never.highlight{
    background-color: #c55;
  }
</style>

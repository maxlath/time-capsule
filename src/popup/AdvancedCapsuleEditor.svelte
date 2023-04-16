<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { slide } from 'svelte/transition'
  import { saveCapsule } from '../lib/actions.js'
  import { parseFrequency } from '../lib/frequency.js'
  import { getDateTimeLocalInputValue, unitsLabels } from '../lib/times.js'
  import { range, repeatNum } from '../lib/utils.js'
  import { repeatsOptions } from '../lib/repeats.js'
  import { getSettingValue } from '../lib/settings_store.js'
  import { getNextVisit } from '../lib/bookmark_title.js'
  import { onChange } from '../lib/svelte.js'
  import { i18n } from '../lib/i18n.js'

  export let url, activeTab = null, bookmark, flash

  const dispatch = createEventDispatcher()

  let frequencyNum = 1
  let frequencyUnit = 'M'
  let noRegrouping = false
  let repeat, nextVisit, title

  if (bookmark) {
    nextVisit = getDateTimeLocalInputValue(bookmark.nextVisit)
    if (bookmark.frequency) {
      ;({ num: frequencyNum, unit: frequencyUnit } = parseFrequency(bookmark.frequency))
    }
    if (bookmark.repeat != null) repeat = bookmark.repeat
    // Title metadata will be recoverd on save
    title = bookmark.cleanedTitle
    noRegrouping = bookmark.noRegrouping
  } else {
    nextVisit = getDateTimeLocalInputValue()
    title = activeTab.title
  }

  const initialTitle = title

  getSettingValue('settings:defaultRepeats')
  .then(defaultRepeatValue => {
    if (bookmark?.repeat == null) repeat = defaultRepeatValue
  })

  const frequencyNumOptions = range(1, 100)

  async function validate () {
    try {
      if (!canValidate) return
      dispatch('celebrate')
      await saveCapsule({
        url,
        title,
        bookmark,
        nextVisit,
        frequency: repeatNum(repeat) > 0 ? `${frequencyNum}${frequencyUnit}` : null,
        repeat,
        noRegrouping,
      })
      dispatch('done')
    } catch (err) {
      flash = err
    }
  }

  function resetNextVisit () {
    const frequency = `${frequencyNum}${frequencyUnit}`
    nextVisit = getDateTimeLocalInputValue(getNextVisit({
      frequency,
      referenceDate: Date.now()
    }))
    nextVisitInputEl.focus()
  }

  let nextVisitInputEl, canValidate
  function udpateValidateButton () {
    canValidate = nextVisitInputEl?.validity.valid
  }

  onMount(() => {
    udpateValidateButton()
    nextVisitInputEl.focus()
  })

  $: onChange(nextVisit, udpateValidateButton)
</script>

<div class="options-selector-advanced">
  <div class="option-group">
    <span>{i18n('Title')}</span>
    <div class="input-group">
      <input type="text"
        bind:value={title}
        on:keydown|stopPropagation
        on:keyup|stopPropagation
      >
      <button
        class="reset"
        disabled={title === initialTitle}
        on:click={() => title = initialTitle}
        title={`Reset the title to its initial value: ${initialTitle}`}
      >reset</button>
    </div>
  </div>

  <div class="option-group">
    <label for="nextVisit">{i18n('Next visit')}</label>
    <div class="input-group">
      <input
        id="nextVisit"
        type="datetime-local"
        min={getDateTimeLocalInputValue()}
        bind:value={nextVisit}
        bind:this={nextVisitInputEl}
        on:keydown|stopPropagation
        on:keyup|stopPropagation
      >
      <button
        class="reset"
        on:click={resetNextVisit}
        title="Reset the date for the next visit, using the selected frequency"
      >reset</button>
    </div>
  </div>

  <label class="option-group">
    <span>{i18n('Repeats')}</span>
    <select bind:value={repeat}>
      {#each repeatsOptions as numOption}
        <option value={numOption}>{numOption}</option>
      {/each}
    </select>
  </label>

  {#if repeat !== 0}
    <fieldset
      class="option-group"
      transition:slide|local={{ duration: 200 }}
    >
      <legend>{i18n('Frequency')}</legend>

      <select
        bind:value={frequencyNum}
        on:keydown|stopPropagation
        on:keyup|stopPropagation
      >
        {#each frequencyNumOptions as numOption}
          <option value={numOption}>{numOption}</option>
        {/each}
      </select>

      <select bind:value={frequencyUnit}>
        {#each Object.entries(unitsLabels) as [ unit, label ]}
          <option value={unit}>{label}</option>
        {/each}
      </select>
    </fieldset>
  {/if}

  <label
    class="option-group input-group has-checkbox"
    title={i18n('Opt-out from regrouping this capsule with others, when the amont of capsules to open is above the maximum allowed ("overflow")')}
  >
    <input type="checkbox" bind:checked={noRegrouping}>
    <span>{i18n('Always open alone')}</span>
  </label>

  <button
    class="validate"
    disabled={!canValidate}
    on:click={validate}
  >
    {i18n('Validate')}
  </button>
</div>

<style>
  .options-selector-advanced{
    align-self: stretch;
    padding: 0.5em;
  }
  .option-group{
    display: block;
    margin: 1em 0;
  }
  .option-group label, .option-group span, .option-group legend{
    display: block;
    margin-bottom: 0.3em;
  }
  .input-group{
    display: flex;
    flex-direction: row;
  }
  .input-group:not(.has-checkbox){
    align-items: center;
    justify-content: space-between;
  }
  .has-checkbox{
    margin: 1.5em auto;
  }
  .option-group.has-checkbox span{
    margin: 0 0.5em;
  }
  input[type="text"], input[type="datetime-local"]{
    flex: 1;
  }
  .reset{
    margin-inline-start: 1em;
    margin-block-end: 0.3em;
    text-decoration: underline;
  }
  input:invalid{
    border: 1px solid red;
  }
  .validate{
    display: block;
    padding: 0.5em;
    border-radius: 3px;
    background-color: var(--success-color);
    margin: 2em auto;
  }
</style>

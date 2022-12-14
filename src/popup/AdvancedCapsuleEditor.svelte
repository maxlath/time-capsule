<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { slide } from 'svelte/transition'
  import { saveCapsule } from '../lib/actions.js'
  import { parseFrequency } from '../lib/frequency.js'
  import { getDateTimeLocalInputValue, unitsLabels } from '../lib/times.js'
  import { range } from '../lib/utils.js'
  import { repeatsOptions } from '../lib/repeats.js'
  import { getSettingValue } from '../lib/settings_store.js'
  import { getNextVisit } from '../lib/bookmark_title.js'
  import { onChange } from '../lib/svelte.js'

  export let url, bookmark, context, flash

  const dispatch = createEventDispatcher()

  let repeat
  let frequencyNum = 1
  let frequencyUnit = 'M'
  let nextVisit

  if (bookmark) {
    nextVisit = getDateTimeLocalInputValue(bookmark.nextVisit)
    if (bookmark.frequency) {
      ;({ num: frequencyNum, unit: frequencyUnit } = parseFrequency(bookmark.frequency))
    }
    if (bookmark.repeat != null) repeat = bookmark.repeat
  } else {
    nextVisit = getDateTimeLocalInputValue()
  }

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
        bookmark,
        nextVisit,
        frequency: repeat > 0 ? `${frequencyNum}${frequencyUnit}` : null,
        repeat,
        context,
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
    <label for="nextVisit">Next visit</label>
    <div class="input-group">
      <input
        id="nextVisit"
        type="datetime-local"
        min={getDateTimeLocalInputValue()}
        bind:value={nextVisit}
        bind:this={nextVisitInputEl}
      >
      <button
        class="reset-next-visit"
        on:click={resetNextVisit}
        title="Reset the date for the next visit, using the selected frequency"
      >reset</button>
    </div>
  </div>

  <label class="option-group">
    <span>Repeats</span>
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
      <legend>Frequency</legend>

      <select bind:value={frequencyNum}>
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

  <button
    class="validate"
    disabled={!canValidate}
    on:click={validate}
  >
    Validate
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
    align-items: center;
    justify-content: flex-start;
  }
  .reset-next-visit{
    margin-inline-start: 1em;
    margin-block-end: 0.3em;
    text-decoration: underline;
  }
  input:invalid{
    border: 1px solid red;
  }
  .validate{
    padding: 0.5em;
    border-radius: 3px;
    background-color: var(--grey-ddd);
  }
</style>

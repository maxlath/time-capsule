<script>
  import { createEventDispatcher } from 'svelte'
  import { slide } from 'svelte/transition'
  import { saveCapsule } from '../lib/actions.js'
  import { parseFrequency } from '../lib/frequency.js'
  import { getDateTimeLocalInputValue, unitsLabels } from '../lib/times.js'
  import { range } from '../lib/utils.js'
  import { repeatsOptions } from '../lib/repeats.js'
  import { getSettingValue } from '../lib/settings_store.js'

  export let url, bookmark, context

  const dispatch = createEventDispatcher()

  let repeat
  let frequencyNum = 1
  let frequencyUnit = 'M'
  let nextVisit

  if (bookmark) {
    nextVisit = getDateTimeLocalInputValue(bookmark.nextVisit)
    ;({ num: frequencyNum, unit: frequencyUnit } = parseFrequency(bookmark.frequency))
    if (bookmark.repeat != null) repeat = bookmark.repeat
  } else {
    nextVisit = getDateTimeLocalInputValue()
  }

  getSettingValue('settings:defaultRepeats')
  .then(defaultRepeatValue => {
    if (bookmark.repeat == null) repeat = defaultRepeatValue
  })

  const frequencyNumOptions = range(1, 100)

  async function validate () {
    await saveCapsule({
      url,
      bookmark,
      nextVisit,
      frequency: `${frequencyNum}${frequencyUnit}`,
      repeat,
      context,
    })
    dispatch('done')
  }

  let nextVisitInputEl
  $: canValidate = nextVisitInputEl?.validity.valid
</script>

<div class="options-selector-advanced">
  <label>
    <span>Next visit</span>
    <input
      type="datetime-local"
      min={getDateTimeLocalInputValue()}
      bind:value={nextVisit}
      bind:this={nextVisitInputEl}
    >
  </label>

  <label>
    <span>Repeats</span>
    <select bind:value={repeat}>
      {#each repeatsOptions as numOption}
        <option value={numOption}>{numOption}</option>
      {/each}
    </select>
  </label>

  {#if repeat !== 0}
    <fieldset transition:slide|local={{ duration: 200 }}>
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
  label, fieldset{
    display: block;
    margin: 1em 0;
  }
  label span, legend{
    display: block;
    margin-bottom: 0.3em;
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

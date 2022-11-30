<script>
  import { createEventDispatcher } from 'svelte'
  import { slide } from 'svelte/transition'
  import { saveCapsule } from '../lib/actions.js'
  import { getDateTimeLocalInputValue, unitsLabels } from '../lib/times.js'
  import { parseFrequency, range } from '../lib/utils.js'

  export let url, bookmark, context

  const dispatch = createEventDispatcher()

  let repeat = '∞'
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

  const frequencyNumOptions = range(1, 100)
  const repetitionsOptions = [ '∞' ].concat(range(0, 10))

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
</script>

<label>
  <span>Next visit</span>
  <input type="datetime-local" bind:value={nextVisit}>
</label>

<label>
  <span>Repetitions</span>
  <select bind:value={repeat}>
    {#each repetitionsOptions as numOption}
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

<button class="validate" on:click={validate}>
  Validate
</button>

<style>
  label, fieldset{
    display: block;
    margin: 1em 0;
  }
  label span, legend{
    display: block;
    margin-bottom: 0.3em;
  }
  .validate{
    padding: 0.5em;
    border-radius: 3px;
  }
</style>

<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { saveCapsule } from '../lib/actions.js'
  import { getDateTimeLocalInputValue } from '../lib/times.js'
  import { onChange } from '../lib/svelte.js'

  export let url, bookmark, context

  const dispatch = createEventDispatcher()

  let nextVisit

  if (bookmark) {
    nextVisit = getDateTimeLocalInputValue(bookmark.nextVisit)
  } else {
    nextVisit = getDateTimeLocalInputValue()
  }

  async function validate () {
    if (!canValidate) return
    dispatch('celebrate')
    await saveCapsule({
      url,
      bookmark,
      nextVisit,
      frequency: null,
      repeat: 0,
      context,
    })
    dispatch('done')
  }

  function resetNextVisit () {
    nextVisit = getDateTimeLocalInputValue()
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

  function onKeydown (e) {
    const { key } = e
    if (key === 'Enter') validate()
  }

  $: onChange(nextVisit, udpateValidateButton)
</script>

<div class="one-time-capsule-editor">
  <div class="option-group">
    <label for="nextVisit">Re-open once:</label>
    <div class="input-group">
      <input
        id="nextVisit"
        type="datetime-local"
        min={getDateTimeLocalInputValue()}
        bind:value={nextVisit}
        bind:this={nextVisitInputEl}
        on:keydown={onKeydown}
      >
      <button
        class="reset-next-visit"
        on:click={resetNextVisit}
        title="Reset the date to today"
      >reset</button>
    </div>
  </div>

  <button
    class="validate"
    disabled={!canValidate}
    on:click={validate}
  >
    Validate
  </button>
</div>

<style>
  .one-time-capsule-editor{
    align-self: stretch;
    padding: 0.5em;
  }
  .option-group{
    display: block;
    margin-bottom: 1em;
  }
  .option-group label{
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
    margin-top: 0.5em;
  }
</style>

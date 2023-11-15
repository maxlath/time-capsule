<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { saveCapsule } from '../lib/actions.js'
  import { getDateTimeLocalInputValue, minute } from '../lib/times.js'
  import { onChange } from '../lib/svelte.js'
  import { i18n } from '../lib/i18n.js'

  export let url, bookmark, flash

  const dispatch = createEventDispatcher()

  let nextVisit, newBookmark

  if (bookmark) {
    nextVisit = getDateTimeLocalInputValue(bookmark.nextVisit)
  } else {
    nextVisit = getDateTimeLocalInputValue(oneMinuteFromNow())
  }

  async function validate () {
    try {
      if (!canValidate) return
      dispatch('celebrate', { action: 'save' })
      newBookmark = await saveCapsule({
        url,
        bookmark,
        nextVisit,
        frequency: null,
        repeat: 0,
      })
      bookmark = bookmark ? Object.assign(bookmark, newBookmark) : newBookmark
      dispatch('done')
    } catch (err) {
      flash = err
    }
  }

  function resetNextVisit () {
    nextVisit = getDateTimeLocalInputValue(oneMinuteFromNow())
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

  function oneMinuteFromNow () {
    return Date.now() + minute
  }

  $: onChange(nextVisit, udpateValidateButton)
</script>

<div class="one-time-capsule-editor">
  <div class="option-group">
    <label for="nextVisit">{i18n('re_open_once')}</label>
    <div class="input-group">
      <input
        id="nextVisit"
        type="datetime-local"
        min={getDateTimeLocalInputValue(oneMinuteFromNow())}
        bind:value={nextVisit}
        bind:this={nextVisitInputEl}
        on:keydown={onKeydown}
      >
      <button
        class="reset-next-visit"
        on:click={resetNextVisit}
        title="Reset the date to today"
      >{i18n('reset')}</button>
    </div>
  </div>

  <button
    class="validate"
    disabled={!canValidate}
    on:click={validate}
  >
    {i18n('Validate')}
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

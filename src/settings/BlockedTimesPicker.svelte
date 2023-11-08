<!-- Inspired by https://github.com/zhunrong/week-time-picker -->
<script>
  import BlockIcon from '../icons/BlockIcon.svelte'
  import { i18n } from '../lib/i18n.js'
  import { getSettingStore } from '../lib/settings_store.js'
  import { days, initWeekTimes, toggleHighlighted, slotIndexAsHour, slotIndexAsHourRange, slots, slotsPerHour, updateHighlighted } from './week_time_picker_helpers.js'

  const blockedWeekTimes = getSettingStore('settings:blockedWeekTimes')

  let highlighted = initWeekTimes()

  function toggleSelection (e) {
    if (!e.currentTarget) return
    if (startingCell) {
      // If a startingCell is set, assume that the mouseup event was not detected
      // and that the click tries to correct that
      onMouseup(e)
    } else {
      const { day, slot } = e.currentTarget.dataset
      $blockedWeekTimes[day][slot] = !$blockedWeekTimes[day][slot]
    }
  }

  function toggleSelectionOnKeydown (e) {
    if (!e.currentTarget) return
    const { day, slot } = e.currentTarget.dataset
    if (e.key === 'Enter') toggleSelection({ day, slot })
  }

  let startingCell
  function onMousedown (e) {
    if (!e.currentTarget) return
    const { day, slot } = e.currentTarget.dataset
    startingCell = { day, slot }
    highlighted = {}
    initWeekTimes(highlighted)
  }
  function onMousemove (e) {
    if (!startingCell) return
    if (!e.currentTarget) return
    const { day, slot } = e.currentTarget.dataset
    const mouseoverCell = { day, slot }
    highlighted = updateHighlighted({ startingCell, mouseoverCell })
  }
  function onMouseup (e) {
    const select = $blockedWeekTimes[startingCell.day][startingCell.slot] !== true
    $blockedWeekTimes = toggleHighlighted({ blockedWeekTimes: $blockedWeekTimes, highlighted, select })
    highlighted = {}
    startingCell = null
  }
</script>

{#if $blockedWeekTimes}
  <div class="week-time-picker">
    <ul class="header">
      {#each days as day}
        <li class="header-day">{i18n(day)}</li>
      {/each}
    </ul>

    <ul class="slots">
      {#each slots as slot, i}
        <li class="slot-row">
          {#if i % slotsPerHour === 0 && i !== 24 * slotsPerHour}
            <div class="slot-label">
              <span>{slotIndexAsHour(i)}</span>
            </div>
          {:else}
            <div class="slot-label-placeholder"></div>
          {/if}
          <ul class="slot-days">
            {#each days as day}
              <li class="day-slot">
                <button
                  class:selected={$blockedWeekTimes[day]?.[i]}
                  class:highlighted={highlighted[day]?.[i]}
                  title={`${i18n(day)} ${slotIndexAsHourRange(i)}`}
                  data-day={day}
                  data-slot={i}
                  on:click={() => toggleSelection({ day, slot: i })}
                  on:click={toggleSelection}
                  on:keydown={e => toggleSelectionOnKeydown({ e, day, slot: i })}
                  on:mousedown={onMousedown}
                  on:mousemove={onMousemove}
                  on:mouseup={onMouseup}
                >
                  {#if $blockedWeekTimes[day]?.[i]}
                    <BlockIcon />
                  {/if}
                </button>
              </li>
            {/each}
          </ul>
        </li>
      {/each}
    </ul>
  </div>
{/if}

<style>
  .week-time-picker{
    --cell-max-width: 8em;
    --cell-height: 2em;
    --slot-label-width: 6em;
  }
  .header{
    display: flex;
    flex: 1;
    height: 2em;
    margin-left: var(--slot-label-width);
  }
  .header-day{
    flex: 1;
    max-width: var(--cell-max-width);
    text-align: center;
  }
  .slot-row{
    max-width: calc(var(--slot-label-width) + 7 * var(--cell-max-width));
    display: flex;
    align-items: stretch;
    height: var(--cell-height);
    border-top: 1px solid var(--grey-aaa);
  }
  .slot-row:last-child{
    border-bottom: 1px solid var(--grey-aaa);
  }
  .slot-label, .slot-label-placeholder{
    width: var(--slot-label-width);
  }
  .slot-label{
    display: flex;
    justify-content: flex-end;
  }
  .slot-label span{
    margin-inline-end: 0.5em;
  }
  .slot-days{
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: stretch;
  }
  .day-slot{
    flex: 1;
    border-right: 1px solid var(--grey-aaa);
    max-width: var(--cell-max-width);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .day-slot:first-child{
    border-left: 1px solid var(--grey-aaa);
  }
  .day-slot button{
    height: 100%;
    width: 100%;
    border: 0;
    padding: 0;
    margin: 0;
    background-color: transparent;
    cursor: cell;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .day-slot button :global(svg){
    max-height: 80%;
  }
  .day-slot button.selected{
    background-color: var(--light-blue);
  }
  .day-slot button.highlighted{
    background-color: var(--darker-light-blue);
  }
</style>

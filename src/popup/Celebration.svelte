<script>
  import ArchiveIcon from '../icons/ArchiveIcon.svelte'
  import CheckIcon from '../icons/CheckIcon.svelte'
  import TrashIcon from '../icons/TrashIcon.svelte'

  export let frequency = null
  export let action = null
</script>

<div class="celebration-wrapper">
  {#if action === 'removed'}
    <div class="icon-wrapper removed"><TrashIcon /></div>
  {:else if action === 'archived'}
    <div class="icon-wrapper archived"><ArchiveIcon /></div>
  {:else if frequency}
    <p>{frequency}</p>
  {:else}
    <div class="icon-wrapper success"><CheckIcon /></div>
  {/if}
</div>

<style>
  .celebration-wrapper{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 15em;
  }
  .celebration-wrapper p{
    font-size: 3em;
    font-weight: bold;
    color: var(--success-color);
    animation-name: grow-out-text;
    animation-duration: 0.5s;
  }
  .icon-wrapper{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 2em;
    width: 2em;
    animation-name: grow-out-svg;
    animation-duration: 0.5s;
  }
  .success{
    fill: var(--success-color);
  }
  .removed{
    fill: var(--danger-color);
  }
  .archived{
    fill: var(--warning-color);
  }

  @keyframes grow-out-text{
    to {
      font-size: 6em;
      opacity: 0;
    }
  }
  @keyframes grow-out-svg{
    to {
      height: 6em;
      width: 6em;
      opacity: 0;
    }
  }
</style>
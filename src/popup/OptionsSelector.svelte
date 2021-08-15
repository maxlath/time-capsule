<script>
  import PeriodicityOptions from './PeriodicityOptions.svelte'

  export let selectedFrequency

</script>

<div id="optionsView">
  <PeriodicityOptions bind:selectedFrequency />
</div>

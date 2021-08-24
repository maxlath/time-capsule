<script>
  import { allOptions } from '../js/popup/options'
  import { i18n } from '../lib/i18n'
</script>

<ul id="help">
{#each Object.entries(allOptions) as [ name, { letter } ] }
  <li>
    <p class="letter">{letter}</p>
    <p class="name">{i18n(name)}</p>
  </li>
{/each}
</ul>

<style>
  #help{
    height: 7em;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
    opacity: 0.8;
  }
  li{
    width: 5em;
    flex: 0 0 auto;
    margin: 0em 0.3em 0em 0.3em;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .letter{
    background-color: #ddd;
    width: 3em;
    border-radius: 1px;
    text-align: center;
  }
  .name{
    text-align: center;
  }
</style>

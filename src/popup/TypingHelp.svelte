<script>
  import { allOptions } from './options.js'
  import { i18n } from '../lib/i18n.js'
</script>

<ul>
  {#each Object.entries(allOptions) as [ name, { letter } ] }
    <li>
      <p class="letter">{letter}</p>
      <p class="name">{i18n(name)}</p>
    </li>
  {/each}
</ul>

<style>
  ul{
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
    background-color: var(--grey-ddd);
    width: 3em;
    border-radius: 1px;
    text-align: center;
  }
  .name{
    text-align: center;
  }
</style>

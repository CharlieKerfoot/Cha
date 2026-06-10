<script lang="ts">
  import { DAYS, DAY_LABELS, SHIFTS, SHIFT_LABELS, shiftKey } from '$lib/availability';

  let { selected = $bindable([]) }: { selected: string[] } = $props();

  function toggle(day: string, shift: string) {
    const key = shiftKey(day, shift);
    selected = selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key];
  }
</script>

<div class="grid-wrap">
  <table>
    <thead>
      <tr>
        <th></th>
        {#each DAYS as day (day)}
          <th>{DAY_LABELS[day]}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each SHIFTS as shift (shift)}
        <tr>
          <th class="shift">{SHIFT_LABELS[shift]}</th>
          {#each DAYS as day (day)}
            {@const key = shiftKey(day, shift)}
            <td>
              <button
                type="button"
                class="cell"
                class:on={selected.includes(key)}
                aria-pressed={selected.includes(key)}
                aria-label={`${DAY_LABELS[day]} ${SHIFT_LABELS[shift]}`}
                onclick={() => toggle(day, shift)}
              ></button>
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
  {#each selected as key (key)}
    <input type="hidden" name="shifts" value={key} />
  {/each}
</div>

<style>
  .grid-wrap {
    overflow-x: auto;
  }

  table {
    border-collapse: separate;
    border-spacing: 4px;
  }

  th {
    font-size: 0.78rem;
    color: var(--roast);
    font-weight: 600;
    text-align: left;
  }

  th.shift {
    padding-right: 0.4rem;
    white-space: nowrap;
  }

  .cell {
    width: 38px;
    height: 30px;
    border-radius: 6px;
    border: 1.5px solid var(--line);
    background: var(--paper);
    cursor: pointer;
    padding: 0;
  }

  .cell:hover {
    border-color: var(--latte);
  }

  .cell.on {
    background: var(--accent);
    border-color: var(--accent);
  }
</style>

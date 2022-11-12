<script lang="ts">
  export let selectedOption: any = null;
  export let availableOptions: { raw: any; text: string }[];
  export let onChanged: () => void;

  let shown = false;
</script>

<button
  id="dropdownDefault"
  data-dropdown-toggle="dropdown"
  class="text-white  bg-black/[.55] hover: bg-black/[.75] focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
  type="button"
  on:focusin={() => {
    shown = true;
  }}
  on:focusout={() => {
    setTimeout(() => {
      shown = false;
    }, 50);
  }}
>
  <slot />
</button>
<!-- Dropdown menu -->
<div
  id="dropdown"
  class="{shown
    ? 'fixed bottom-28'
    : 'hidden'} z-10 bg-white rounded-md divide-y divide-gray-100 shadow dark:bg-gray-700"
>
  <ul
    class="py-1 text-sm text-gray-700 dark:text-gray-200"
    aria-labelledby="dropdownDefault"
  >
    {#each availableOptions ?? [] as option}
      <li>
        <button
          class="block py-4 px-8 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          on:click|preventDefault={() => {
            selectedOption = option.raw;
            onChanged();
          }}
        >
          {option.text}
        </button>
      </li>
    {/each}
  </ul>
</div>

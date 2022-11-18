<script lang="ts">
  export let code: number;
</script>

<div>
  <label for="ticketCode" class="block mb-2 text-sm font-medium text-white">
    Cod Bilet (fară prefix)
  </label>
  <div class="flex items-center">
    <div class="mr-2"><b class="text-white whitespace-nowrap">LB22 - </b></div>
    <input
      type="number"
      name="ticketCode"
      class="border bg-gray-700 border-gray-600 focus:ring-primary-600 ring-offset-gray-800 text-white sm:text-sm rounded-lg focus:ring-ticketLighterBlue focus:border-ticketLightBlue block w-full p-2.5"
      placeholder="000000"
      required={true}
      bind:value={code}
      on:input={() => {
        const s = code.toString();
        if (s.length > 6) {
          code = parseInt(s.substring(0, 6));
        }
        if (s.indexOf(".") != -1) {
          code = null;
        }
      }}
    />
  </div>
</div>

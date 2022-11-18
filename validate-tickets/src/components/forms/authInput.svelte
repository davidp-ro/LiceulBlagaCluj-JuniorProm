<script lang="ts">
  export let authCode: number;
</script>

<div>
  <label
    for="verificationCode"
    class="block mb-2 text-sm font-medium text-white"
  >
    Cod Autentificare
  </label>
  <input
    type="number"
    name="verificationCode"
    class="lb22_verificationCodeInput text-sm border bg-gray-700 border-gray-600 focus:ring-primary-600 ring-offset-gray-800 text-white sm:text-sm rounded-lg focus:ring-ticketLighterBlue focus:border-ticketLightBlue block w-full p-2.5"
    placeholder="Introduceți codul de autentificare (6 cifre)"
    required={true}
    bind:value={authCode}
    on:input={() => {
      const s = authCode.toString();
      if (s.length > 6) {
        authCode = parseInt(s.substring(0, 6));
      }
      if (s.indexOf(".") != -1) {
        authCode = null;
      }
    }}
  />
</div>

<style>
  .lb22_verificationCodeInput {
    text-security: disc;
    -webkit-text-security: disc;
    -moz-text-security: disc;
  }
</style>

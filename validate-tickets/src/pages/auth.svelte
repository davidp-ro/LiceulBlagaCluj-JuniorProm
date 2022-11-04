<script lang="ts">
  import { AuthAPI } from "../lib/authApi";
  import { isAuthenticated } from "../stores";

  let form: HTMLFormElement;
  let authCode: number;
  let isLoading = false;
  let loggedIn = false;

  const authenticate = async () => {
    if (isLoading) {
      return;
    }
    isLoading = true;

    const res = await AuthAPI.validateAuthCode(authCode.toString());
    console.log(res);
    if (res.isNowAuthenticated) {
      loggedIn = true;
      isLoading = false;
      setTimeout(() => {
        isAuthenticated.set(true);
      }, 1000);
    } else {
      alert(`Error / Eroare - ${res.responseText}`);
    }

    isLoading = false;
  };
</script>

<section>
  <div
    class="flex flex-col items-center px-4 pt-36 md:pt-0 md:h-screen md:justify-center"
  >
    <div
      class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0"
    >
      <div class="p-6 sm:p-8">
        <div class="mb-4">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl"
          >
            Verificare Bilete Balul Bobocilor
          </h1>
          <h3>Liceul Teoretic "Lucian Blaga" Cluj</h3>
        </div>

        {#if isLoading}
          Autentificare...
        {:else if !loggedIn}
          <form class="space-y-4 md:space-y-6" bind:this={form}>
            <div>
              <label
                for="verificationCode"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                Cod Autentificare
              </label>
              <input
                type="number"
                name="verificationCode"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-ticketLighterBlue focus:border-ticketLightBlue block w-full p-2.5"
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
            <button
              class="w-full text-white bg-ticketLightBlue focus:ring-4 focus:outline-none focus:ring-ticketLighterBlue font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              type="button"
              disabled={isLoading}
              on:click|preventDefault|stopPropagation={async () => {
                await authenticate();
              }}
            >
              Sign in
            </button>
          </form>
        {:else if loggedIn}
          Success!
        {/if}
      </div>
    </div>
  </div>
</section>

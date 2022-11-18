<script lang="ts">
  import { get } from "svelte/store";
  import { MixpanelService } from "../lib/mixpanel";
  import { AuthAPI } from "../lib/authApi";
  import { isAuthenticated, loggedInUser } from "../stores";

  import AuthCard from "../components/forms/authCard.svelte";
  import AuthInput from "../components/forms/authInput.svelte";

  let _form: HTMLFormElement;
  let authCode: number;
  let isLoading = false;
  let loggedIn = false;

  const authenticate = async () => {
    if (!authCode || authCode.toString().length !== 6) {
      alert("Codul contine 6 cifre / The code contains 6 digits!");
      return;
    }

    if (isLoading) {
      return;
    }
    isLoading = true;

    const res = await AuthAPI.validateAuthCode(authCode.toString());

    if (res.isNowAuthenticated) {
      loggedIn = true;
      isLoading = false;
      loggedInUser.set(res.responseText);

      setTimeout(() => {
        isAuthenticated.set(true);
      }, 800);

      MixpanelService.event("authenticated", {
        user: get(loggedInUser),
      });
    } else {
      MixpanelService.event("error", {
        type: "AuthError",
        error: res.responseText,
        user: get(loggedInUser),
      });

      alert(
        `Eroare la autentificare / Authentication error - ${res.responseText}`
      );
    }

    isLoading = false;
  };
</script>

<section>
  <AuthCard>
    <div class="mb-4">
      <h1 class="text-xl font-bold text-white md:text-2xl">
        Verificare Bilete Balul Bobocilor
      </h1>
      <h3 class="text-sm text-gray-300 md:text-2xl">
        Liceul Teoretic "Lucian Blaga" Cluj
      </h3>
    </div>

    {#if isLoading}
      <span class="text-white">⌛ Autentificare...</span>
    {:else if !loggedIn}
      <form
        class="space-y-4 md:space-y-6"
        bind:this={_form}
        on:submit|preventDefault={() => {}}
      >
        <AuthInput bind:authCode />

        <button
          class="w-full text-white bg-primary-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          type="button"
          disabled={isLoading}
          on:click|preventDefault={async () => {
            await authenticate();
          }}
        >
          Autentificare
        </button>

        <hr class="border border-gray-700" />
        <div class="text-gray-400 text-xs">
          Notă: Acest website folosește cookie-uri obligatorii de statistică /
          raportare de erori 🍪
        </div>
      </form>
    {:else if loggedIn}
      <span class="text-white">✅ Success!</span>
    {/if}
  </AuthCard>
</section>

<script lang="ts">
  import AuthCard from "../components/forms/authCard.svelte";
  import TicketCodeInput from "../components/forms/ticketCodeInput.svelte";
  import { ValidateAPI, type ValidateApiResponse } from "../lib/validateApi";
  import { currentPage } from "../stores";

  let _form: HTMLFormElement;
  let code: number;
  let isLoading = false;
  let validateResult: ValidateApiResponse = null;

  const validate = async () => {
    if (isLoading) return;
    isLoading = true;

    validateResult = await ValidateAPI.validateTicket(`LB22-${code}`);

    isLoading = false;
  };
</script>

<section>
  <AuthCard>
    <div class="mb-4">
      <h1 class="text-xl font-bold text-white md:text-2xl">
        Verificare Manuală Bilet
      </h1>
    </div>

    {#if isLoading}
      <span class="text-white">⌛ Se verifică...</span>
    {:else if validateResult === null}
      <form
        class="space-y-4 md:space-y-6"
        bind:this={_form}
        on:submit|preventDefault={() => {}}
      >
        <TicketCodeInput bind:code />

        <button
          class="w-full text-white bg-primary-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          type="button"
          disabled={isLoading}
          on:click|preventDefault={validate}
        >
          Verifică
        </button>
        <hr class="my-2 border-gray-700" />
        <button
          class="w-full text-white bg-gray-900 hover:bg-black focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          type="button"
          on:click|preventDefault={() => {
            currentPage.set("scan");
          }}
        >
          Mergi înapoi la scanare
        </button>
      </form>
    {:else}
      <div>
        {#if validateResult.isValid}
          <span class="text-white">
            <span class="text-2xl font-bold">✅ Validat</span>
            <br />
            <br />
            Bilet: {validateResult.ticket.code}
            <br />
            Tip bilet: {validateResult.ticket.ticket_type == "student+generic"
              ? "Elev"
              : "VIP"}
            <br />
            Intrări rămase: {validateResult.ticket.entries_remaining}
          </span>
        {:else}
          <span class="text-white">
            <span class="text-4xl font-bold text-red-400"> ❌ INVALID </span>
            <br />
            <br />
            Detalii: {validateResult.error}
          </span>
        {/if}

        <div class="mt-4">
          <button
            class="w-full text-white bg-primary-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            type="button"
            disabled={isLoading}
            on:click|preventDefault={() => {
              code = null;
              validateResult = null;
            }}
          >
            Ok
          </button>
          <hr class="my-2 border-gray-700" />
          <button
            class="w-full text-white bg-gray-900 hover:bg-black focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            type="button"
            on:click|preventDefault={() => {
              currentPage.set("scan");
            }}
          >
            Mergi înapoi la scanare
          </button>
        </div>
      </div>
    {/if}
  </AuthCard>
</section>

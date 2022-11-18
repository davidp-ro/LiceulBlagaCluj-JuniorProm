<script>
  import { currentPage, isAuthenticated } from "./stores";
  import { MixpanelService } from "./lib/mixpanel";

  import Auth from "./pages/auth.svelte";
  import Scan from "./pages/scan.svelte";
  import EnterCode from "./pages/enterCode.svelte";

  MixpanelService.init();
</script>

<main>
  {#if $isAuthenticated}
    {#if $currentPage === "scan"}
      <Scan />
    {:else if $currentPage === "enterCode"}
      <EnterCode />
    {/if}
  {:else}
    <Auth />
  {/if}
</main>

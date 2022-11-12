<script>
  import { isAuthenticated } from "./stores";
  import { MixpanelService } from "./lib/mixpanel";

  import Auth from "./pages/auth.svelte";
  import Scan from "./pages/scan.svelte";

  MixpanelService.init();
</script>

<main>
  {#if $isAuthenticated}
    <Scan />
  {:else}
    <Auth />
  {/if}
</main>

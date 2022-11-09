<script>
  import { isAuthenticated } from "./stores";
  import { MixpanelService } from "./lib/mixpanel";

  import Auth from "./pages/auth.svelte";
  import Scan from "./pages/scan.svelte";

  MixpanelService.init();
</script>

<main class="bg-gray-900 h-screen">
  {#if $isAuthenticated}
    <Scan />
  {:else}
    <Auth />
  {/if}
</main>

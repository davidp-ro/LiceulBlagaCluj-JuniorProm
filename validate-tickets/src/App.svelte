<script>
  import { isAuthenticated } from "./stores";

  import Auth from "./pages/auth.svelte";
  import Scan from "./pages/scan.svelte";
</script>

<main class="bg-gray-50">
  {#if $isAuthenticated}
    <Scan />
  {:else}
    <Auth />
  {/if}
</main>

<script lang="ts">
  import { onMount } from "svelte";
  import { BarcodeReader } from "./lib/barcodeReader";

  onMount(async () => {
    await BarcodeReader.init("barcodeScannerContainer");
  });
</script>

<main>
  <div id="barcodeScannerContainer" />

  <div class="m-10">
    <button
      on:click|preventDefault={() => {
        BarcodeReader.startScanning(
          BarcodeReader.availableCameras[0],
          { width: 300, height: 180 },
          (res, raw) => {
            alert(`Scan: ${res}`);
          },
          (err) => {}
        );
      }}
    >
      Start
    </button>
    <button
      on:click|preventDefault={() => {
        BarcodeReader.stopScanning();
      }}
    >
      Stop
    </button>
  </div>
</main>

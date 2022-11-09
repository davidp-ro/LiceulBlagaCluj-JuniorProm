<script lang="ts">
  import { onMount } from "svelte";
  import { BarcodeReader } from "../lib/barcodeReader";

  onMount(() => {
    setTimeout(async () => {
      await BarcodeReader.init("barcodeScannerContainer");
    }, 250);
  });

  const onStarted = () => {
    const border = document.getElementById("qr-shaded-region");
    const lines = border.childNodes;

    border.style.borderColor = "red";
    lines.forEach((element: HTMLElement) => {
      element.style.display = 'none';
    });
  };
</script>

<section>
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
          (err) => {},
          onStarted,
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
</section>

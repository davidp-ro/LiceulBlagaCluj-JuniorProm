<script lang="ts">
  import { get } from "svelte/store";
  import { onMount } from "svelte";

  import {
    BarcodeReader,
    type OnErrorCallback,
    type OnResultCallback,
    type OnStartedCallback,
  } from "../lib/barcodeReader";
  import { MixpanelService } from "../lib/mixpanel";
  import { loggedInUser } from "../stores";

  onMount(() => {
    setTimeout(async () => {
      await BarcodeReader.init("barcodeScannerContainer");
    }, 50);
  });

  const onResult: OnResultCallback = (text, _) => {
    MixpanelService.event("scan", {
      code: text,
      user: get(loggedInUser),
    });
    MixpanelService.incrementCounter("scans");

    alert(text);
  };

  const onError: OnErrorCallback = (error) => {
    MixpanelService.event("error", {
      type: "ScanError",
      error,
      user: get(loggedInUser),
    });
  };

  const onStarted: OnStartedCallback = () => {
    const border = document.getElementById("qr-shaded-region");
    const lines = border.childNodes;

    border.style.borderColor = "red";
    lines.forEach((element: HTMLElement) => {
      element.style.display = "none";
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
          onResult,
          onError,
          onStarted
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

<script lang="ts">
  import { get } from "svelte/store";
  import { onMount } from "svelte";

  import Dropdown from "../components/dropdown.svelte";
  import {
    BarcodeReader,
    type OnErrorCallback,
    type OnResultCallback,
    type OnStartedCallback,
  } from "../lib/barcodeReader";
  import { MixpanelService } from "../lib/mixpanel";
  import { loggedInUser } from "../stores";
  import type { CameraDevice } from "html5-qrcode/esm/core";

  let selectedOption: CameraDevice = null;
  let availableCameras: CameraDevice[] = [];
  let availableOptions: any;

  onMount(() => {
    setTimeout(async () => {
      await BarcodeReader.init("barcodeScannerContainer");
      availableCameras = BarcodeReader.availableCameras;

      if (!availableCameras || availableCameras.length == 0) {
        alert(
          "Ceva nu a mers bine / Something went wrong! - Nu a fost gasita nici o camera, verificati permisiunile / No camera found, check permissions!"
        );

        MixpanelService.event("error", {
          type: "NoCameraFoundError",
          error: "No camera was found after BarcodeReader.init",
          user: get(loggedInUser),
        });
      } else {
        availableOptions = availableCameras.map((c) => {
          return { raw: c, text: c.label };
        });
        console.log(availableOptions);
        selectedOption = availableOptions[0];
      }
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
    if (
      error === "QR code parse error, error = No barcode or QR code detected."
    ) {
      // We're ignoring this particular error as it's firing continuously
      return;
    }

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

  {#if availableCameras.length > 0}
    <Dropdown
      dropdownName="Camere"
      bind:selectedOption
      {availableOptions}
      onChanged={() => {
        BarcodeReader.stopScanning();
        BarcodeReader.startScanning(
          selectedOption,
          { width: 300, height: 180 },
          onResult,
          onError,
          onStarted
        );
      }}
    />
  {/if}

  <div class="m-10">
    <button
      on:click|preventDefault={() => {
        BarcodeReader.stopScanning();
      }}
    >
      Stop
    </button>
  </div>
</section>

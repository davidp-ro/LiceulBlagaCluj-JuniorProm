<script lang="ts">
  import { get } from "svelte/store";
  import { onMount } from "svelte";
  import { loggedInUser } from "../stores";
  import {
    Alignment,
    Fit,
    Layout,
    Rive,
    StateMachineInput,
  } from "@rive-app/canvas";

  import type { CameraDevice } from "html5-qrcode/esm/core";
  import {
    BarcodeReader,
    type OnResultCallback,
    type OnStartedCallback,
  } from "../lib/barcodeReader";
  import { MixpanelService } from "../lib/mixpanel";

  import Dropdown from "../components/dropdown.svelte";
  import BottomButtonContainer from "../components/scan/bottomButtonContainer.svelte";
  import SwitchCameraIcon from "../components/icons/switchCameraIcon.svelte";
  import TorchIcon from "../components/icons/torchIcon.svelte";
  import { ValidateAPI, type ValidateApiResponse } from "../lib/validateApi";

  let selectedOption: CameraDevice = null;
  let availableCameras: CameraDevice[] = [];
  let availableOptions: any;
  let lastScannedCode: string = "none";
  let hasScannedTicket = false;
  let scannedTicketResponse: ValidateApiResponse = null;

  let riveVerifiedTrigger: StateMachineInput;
  let riveFailedTrigger: StateMachineInput;

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
        let idx = 0;
        availableOptions = availableCameras.map((c) => {
          ++idx;
          return { raw: c, text: `Camera ${idx}` };
        });
        selectedOption = availableOptions[0];
      }

      // Rive:
      const layout = new Layout({
        fit: Fit.ScaleDown,
        alignment: Alignment.CenterLeft,
      });

      const rive = new Rive({
        layout,
        src: "/animations/scan.riv",
        canvas: document.getElementById("riveCanvas"),
        autoplay: true,
        stateMachines: "machine",
        onLoad: (_) => {
          const inputs = rive.stateMachineInputs("machine");
          riveVerifiedTrigger = inputs.find((i) => i.name === "verified");
          riveFailedTrigger = inputs.find((i) => i.name === "failed_verified");
        },
      });
    }, 50);
  });

  const hideAnimation = () => {
    setTimeout(() => {
      hasScannedTicket = false;
    }, 750);
  };

  const onResult: OnResultCallback = async (text, _) => {
    if (text == lastScannedCode) {
      return;
    }
    lastScannedCode = text;
    hasScannedTicket = true;

    if (text.length !== 11 || !text.startsWith("LB22-")) {
      MixpanelService.event("error", {
        type: "SoftError_UnknownResult",
        error: `Scanned unknown code: ${text}`,
        user: get(loggedInUser),
      });
      return;
    }

    scannedTicketResponse = await ValidateAPI.validateTicket(text);

    if (scannedTicketResponse.isValid) {
      riveVerifiedTrigger.fire();
      setTimeout(() => {
        riveVerifiedTrigger.fire();
        hideAnimation();
      }, 5000);
    } else {
      riveFailedTrigger.fire();
      setTimeout(() => {
        riveFailedTrigger.fire();
        hideAnimation();
      }, 5000);
    }

    MixpanelService.event("scan", {
      code: text,
      user: get(loggedInUser),
    });
    MixpanelService.incrementCounter("scans");
  };

  const onStarted: OnStartedCallback = () => {
    // const scanHeader = document.getElementById("scanHeader");
    const border = document.getElementById("qr-shaded-region");
    const video = document.getElementsByTagName("video")[0];
    const lines = border.childNodes;

    video.style.borderRadius = "8px";

    border.style.borderColor = "#97979761";
    border.style.borderRadius = "8px";

    lines.forEach((element: HTMLElement) => {
      element.style.display = "";
    });
  };
</script>

<section>
  <div
    class="flex bg-gray-900"
    style="flex-flow: column; position: absolute; height: 100%; width: 100%"
  >
    <div
      class="notification flex flex-col {hasScannedTicket
        ? 'items-start justify-start'
        : 'items-center justify-center'}"
      style="flex: 1 1"
    >
      {#if !hasScannedTicket}
        <span
          class="absolute text-center text-4xl font-bold text-primary-50 tracking-wide"
        >
          SCANEAZĂ<br /> UN BILET
        </span>
      {/if}

      <div
        class={hasScannedTicket ? "grid" : "hidden"}
        style="grid-template-columns: 35vw 65vw;"
      >
        <canvas id="riveCanvas" />
        <div class="text-white">
          {#if scannedTicketResponse}
            {#if scannedTicketResponse.isValid}
              Valid - {scannedTicketResponse.ticket.entries_remaining}
            {:else}
              Invalid
            {/if}
          {/if}
        </div>
      </div>
    </div>
    <div class="p-4 bg-grey-500" style="flex: 0 1">
      <div id="barcodeScannerContainer" />
    </div>
  </div>

  <BottomButtonContainer>
    {#if availableCameras.length > 0}
      <Dropdown
        bind:selectedOption
        {availableOptions}
        onChanged={() => {
          BarcodeReader.stopScanning();
          BarcodeReader.startScanning(
            selectedOption,
            { width: 300, height: 180 },
            onResult,
            () => {},
            onStarted
          );
        }}
      >
        <SwitchCameraIcon />
      </Dropdown>

      <button
        class="mx-4 text-white w-full font-semibold tracking-widest text-xl  bg-black/[.55] hover: bg-black/[.75] focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-xl x-4 py-2.5 inline-flex items-center justify-center"
        type="button"
        on:click={() => {}}
      >
        ENTER ID
      </button>

      <button
        class="text-white bg-black/[.55] hover: bg-black/[.75] focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-xl text-sm px-4 py-2.5 text-center inline-flex items-center"
        type="button"
        on:click={() => {}}
      >
        <TorchIcon />
      </button>
    {/if}
  </BottomButtonContainer>
</section>

import { Html5Qrcode } from "html5-qrcode";
import type {
  CameraDevice,
  Html5QrcodeResult,
  QrDimensions,
} from "html5-qrcode/core";

export type OnResultCallback = (
  resultText: string,
  raw: Html5QrcodeResult
) => void;
export type OnErrorCallback = (errorText: string) => void;
export type OnStartedCallback = () => void;

export class BarcodeReader {
  public static availableCameras: CameraDevice[] = [];
  private static wasInitialized = false;
  private static instance: Html5Qrcode;

  static async init(readerContainerId: string) {
    try {
      const devices = await Html5Qrcode.getCameras();

      if (devices && devices.length) {
        this.availableCameras = devices;
        this.wasInitialized = true;

        this.instance = new Html5Qrcode(readerContainerId, {
          useBarCodeDetectorIfSupported: true,
          verbose: false,
        });
      } else {
        alert("No cameras found / Nu au fost gasite camere");
      }
    } catch (e) {
      alert(`Failed to initialize / Initializare esuata - ${e}`);
    }
  }

  static async startScanning(
    selectedCamera: CameraDevice,
    scanBox: QrDimensions,
    onResult: OnResultCallback,
    onError: OnErrorCallback,
    onStarted: OnStartedCallback
  ) {
    if (!this.wasInitialized) {
      alert(
        "BarcodeReader was not initialized / BarcodeReader nu a fost initializat"
      );
      return;
    }

    try {
      await this.instance.start(
        selectedCamera.id,
        {
          fps: 60,
          qrbox: scanBox,
        },
        (resultText, rawResult) => {
          onResult(resultText, rawResult);
        },
        (error) => {
          onError(error);
        }
      );

      onStarted();
    } catch (e) {
      alert(`Failed to start scanning / Eroare la pornire scanare - ${e}`);
    }
  }

  static async stopScanning() {
    if (this.wasInitialized) {
      await this.instance.stop();
    }
  }
}

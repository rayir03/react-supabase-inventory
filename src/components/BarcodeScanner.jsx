import BarcodeScannerComponent from "react-qr-barcode-scanner";

export default function BarcodeScanner({ onScan }) {
  return (
    <BarcodeScannerComponent
      width={320}
      height={320}
      onUpdate={(err, result) => {
        if (result) {
          onScan(result.text);
        }
      }}
    />
  );
}

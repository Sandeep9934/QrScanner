// File: src/QRCodeScanner.jsx
import React, { useState } from "react";
import QrReader from "react-qr-reader";
import axios from "axios";

export default function QRCodeScanner() {
  const [scannedCodes, setScannedCodes] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState(null);

  const handleScan = async (data) => {
    if (data) {
      try {
        const response = await axios.post("/qrcodes", { content: data });
        if (response.status === 201) {
          setScannedCodes((prevScannedCodes) => [
            ...prevScannedCodes,
            { id: response.data.id, content: data }
          ]);
        }
      } catch (error) {
        console.error(error);
        setScanError("Failed to save scanned QR code.");
      }
    }
  };

  const handleError = (error) => {
    console.error(error);
    setScanError("Failed to scan QR code.");
  };

  const handleStartScan = () => {
    setScanning(true);
    setScanError(null);
  };

  const handleCancelScan = () => {
    setScanning(false);
  };

  return (
    <div>
      {scanning ? (
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          facingMode="environment"
        />
      ) : (
        <button onClick={handleStartScan}>Scan QR Code</button>
      )}
      {scanError && <p>{scanError}</p>}
      <ul>
        {scannedCodes.map((code) => (
          <li key={code.id}>
            <img src={code.thumbnail} alt={code.content} />
            <p>{code.content}</p>
            <button onClick={() => deleteQRCode(code.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

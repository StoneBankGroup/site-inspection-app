import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist'; // Import PDF.js for PDF rendering

export default function SiteInspection() {
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file

    if (!file) {
      setErrorMessage('No file selected!');
      return;
    }

    // Check if it's a PDF
    if (file.type === 'application/pdf') {
      displayPDF(file);
      setErrorMessage(null);
    }
    // Check if it's an image
    else if (file.type.startsWith('image/')) {
      displayImage(file);
      setErrorMessage(null);
    }
    // Unsupported file type
    else {
      setErrorMessage('Please upload a valid PDF or image file.');
    }
  };

  const displayPDF = (file) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const pdfData = new Uint8Array(event.target.result);
      const pdf = await pdfjsLib.getDocument(pdfData).promise;
      const page = await pdf.getPage(1); // Render only the first page of the PDF
      const viewport = page.getViewport({ scale: 1.0 });

      const canvas = document.getElementById('fileDisplayCanvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      page.render({ canvasContext: context, viewport });
    };
    reader.readAsArrayBuffer(file); // Read the file as binary
  };

  const displayImage = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const canvas = document.getElementById('fileDisplayCanvas');
      const context = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
      };
      img.src = event.target.result; // Load the image into the canvas
    };
    reader.readAsDataURL(file); // Read the file as a data URL
  };

  return (
    <div>
      <h1>Site Inspection File Upload</h1>
      {/* File Input */}
      <input type="file" id="fileInput" onChange={handleFileChange} />
      
      {/* Error Message */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {/* Canvas to display the uploaded file */}
      <canvas
        id="fileDisplayCanvas"
        style={{ border: '1px solid black', marginTop: '20px' }}
      ></canvas>
    </div>
  );
}

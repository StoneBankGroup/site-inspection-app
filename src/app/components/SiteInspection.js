'use client';

import React, { useState } from 'react';
import { Menu, X, Upload } from 'lucide-react';
import { renderPDFToCanvas, addPinToCanvas, exportAnnotationsToWord, annotationCategories } from './annotationUtils';

const annotations = [];
const canvas = document.getElementById('pdfCanvas');

// Load a sample PDF (replace with your PDF file)
const pdfData = 'path/to/your/pdf/file.pdf';
renderPDFToCanvas(pdfData, canvas);

// Handle Canvas Clicks for Markup
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const selectedCategory = 'defect'; // Replace with category selection logic
    addPinToCanvas(canvas, x, y, selectedCategory);

    annotations.push({ category: selectedCategory, x, y, comment: '' });
});

// Export Annotations to Word
document.getElementById('exportButton').addEventListener('click', () => {
    exportAnnotationsToWord(annotations);
});

export default function SiteInspection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handlePlanUpload = (e) => {
    const files = Array.from(e.target.files);
    console.log('Files selected:', files);
    // We'll implement the full upload functionality next
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b z-50 px-4 py-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="font-semibold">Site Inspection App</h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Side Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black opacity-50" 
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-4/5 max-w-sm bg-white p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Menu</h2>
              <button onClick={() => setIsMenuOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <label className="block">
                <span className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md">
                  <Upload className="w-4 h-4" />
                  Upload Plans
                </span>
                <input
                  type="file"
                  multiple
                  accept="application/pdf"
                  className="hidden"
                  onChange={handlePlanUpload}
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="pt-16 pb-20 p-4">
        <p className="text-center text-gray-500">
          Upload a plan to begin inspection
        </p>
      </div>
    </div>
  );
}
<canvas id="pdfCanvas" style="border: 1px solid black;"></canvas>
<button id="exportButton">Export Annotations</button>

'use client';

import React, { useState } from 'react';
import { Menu, X, Upload } from 'lucide-react';

export default function SiteInspection() {
  const [isInitialized, setIsInitialized] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold">Site Inspection App</h1>
      <p className="mt-4">Click the menu to start an inspection</p>
    </div>
  );
}
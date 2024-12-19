'use client';

import React, { useState } from 'react';
import { AlertCircle, Upload, Download, Search, Filter, Menu, X, Plus, ChevronLeft } from 'lucide-react';

export default function Home() {
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [pins, setPins] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [observation, setObservation] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPinMode, setIsPinMode] = useState(false);
  const [activeView, setActiveView] = useState('plan'); // 'plan', 'observation', 'planList'

  const categories = ['Structural', 'Electrical', 'Plumbing', 'Safety', 'General'];

  const handlePlanUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPlans = files.map(file => ({
      id: Date.now(),
      name: file.name,
      url: URL.createObjectURL(file),
      uploadDate: new Date().toISOString()
    }));
    setPlans([...plans, ...newPlans]);
    if (!currentPlan) setCurrentPlan(newPlans[0]);
    setActiveView('plan');
  };

  const handleImageClick = (e) => {
    if (!currentPlan || !isPinMode) return;
    
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newPin = {
      id: Date.now(),
      planId: currentPlan.id,
      x,
      y,
      observation: '',
      category: 'General',
      dateCreated: new Date().toISOString()
    };
    setPins([...pins, newPin]);
    setSelectedPin(newPin);
    setActiveView('observation');
    setIsPinMode(false);
  };

  const handlePinClick = (pin, e) => {
    e.stopPropagation();
    setSelectedPin(pin);
    setObservation(pin.observation);
    setActiveView('observation');
  };

  const saveObservation = () => {
    setPins(pins.map(pin =>
      pin.id === selectedPin.id
        ? { ...pin, observation }
        : pin
    ));
    setSelectedPin(null);
    setObservation('');
    setActiveView('plan');
  };

  const renderTopBar = () => (
    <div className="fixed top-0 left-0 right-0 bg-white border-b z-50 px-4 py-2">
      <div className="flex items-center justify-between">
        {activeView !== 'plan' ? (
          <button
            onClick={() => setActiveView('plan')}
            className="p-2"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        ) : (
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <h1 className="font-semibold">
          {activeView === 'plan' && currentPlan?.name}
          {activeView === 'observation' && 'Add Observation'}
          {activeView === 'planList' && 'Select Plan'}
        </h1>
        {activeView === 'plan' && (
          <button
            onClick={() => setIsPinMode(!isPinMode)}
            className={`p-2 rounded-full ${isPinMode ? 'bg-blue-500 text-white' : ''}`}
          >
            <Plus className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );

  const renderSideMenu = () => (
    <div className={`fixed inset-0 z-50 ${isMenuOpen ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsMenuOpen(false)} />
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
              accept="image/*"
              className="hidden"
              onChange={handlePlanUpload}
            />
          </label>
          
          <button
            onClick={() => {
              setActiveView('planList');
              setIsMenuOpen(false);
            }}
            className="w-full px-4 py-2 text-left border rounded-md"
          >
            Switch Plan
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {renderTopBar()}
      {renderSideMenu()}
      
      <div className="pt-16 pb-20">
        {activeView === 'plan' && (
          <div className="relative">
            {currentPlan ? (
              <>
                <img
                  src={currentPlan.url}
                  alt={currentPlan.name}
                  className="w-full h-auto"
                  onClick={handleImageClick}
                />
                {pins
                  .filter(pin => pin.planId === currentPlan.id)
                  .map((pin) => (
                    <div
                      key={pin.id}
                      className="absolute touch-manipulate"
                      style={{
                        left: `${pin.x}%`,
                        top: `${pin.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <AlertCircle
                        className="w-8 h-8 text-red-500"
                        onClick={(e) => handlePinClick(pin, e)}
                      />
                    </div>
                  ))}
              </>
            ) : (
              <div className="p-4 text-center text-gray-500">
                Upload a plan to begin inspection
              </div>
            )}
          </div>
        )}

        {activeView === 'observation' && (
          <div className="p-4">
            <select
              value={selectedPin?.category || 'General'}
              onChange={(e) => {
                setPins(pins.map(p =>
                  p.id === selectedPin.id
                    ? { ...p, category: e.target.value }
                    : p
                ));
              }}
              className="w-full p-3 mb-4 border rounded-lg text-lg"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <textarea
              className="w-full p-3 border rounded-lg text-lg mb-4"
              rows="6"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Enter your observation here..."
            />
            
            <button
              className="w-full py-3 bg-blue-500 text-white rounded-lg text-lg"
              onClick={saveObservation}
            >
              Save Observation
            </button>
          </div>
        )}

        {activeView === 'planList' && (
          <div className="p-4">
            {plans.map(plan => (
              <button
                key={plan.id}
                onClick={() => {
                  setCurrentPlan(plan);
                  setActiveView('plan');
                }}
                className="w-full p-4 mb-2 border rounded-lg text-left"
              >
                <p className="font-medium">{plan.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(plan.uploadDate).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
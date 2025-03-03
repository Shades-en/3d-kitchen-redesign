import React, { useState } from 'react';
import { Download, Upload, Plus, Trash, RotateCcw } from 'lucide-react';
import { useKitchenStore } from '../store';
import { KitchenItem } from '../types';
import { MeasurementsDialog } from './MeasurementsDialog';

export function Controls() {
  const { items, selectedItemId, addItem, removeItem, importLayout, boundary, updateItem } = useKitchenStore();
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [selectedType, setSelectedType] = useState<KitchenItem['type'] | null>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify({ items, boundary });
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'kitchen-layout.json');
    linkElement.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.items && Array.isArray(data.items)) {
            importLayout(data.items);
          }
        } catch (error) {
          console.error('Failed to parse layout file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleAddClick = (type: KitchenItem['type']) => {
    setSelectedType(type);
    setShowMeasurements(true);
  };

  const handleMeasurementsSubmit = (dimensions: { width: number; height: number; depth: number }) => {
    if (selectedType) {
      const colors = {
        cabinet: '#8B4513',
        countertop: '#808080',
        appliance: '#C0C0C0',
      };

      // Place items at a valid position within the kitchen boundary
      const yPos = selectedType === 'countertop' ? 0.9 : 0;
      const xPos = Math.min(dimensions.width / 2, boundary.width / 2 - dimensions.width);
      const zPos = Math.min(dimensions.depth / 2, boundary.depth / 2 - dimensions.depth);

      addItem({
        id: Math.random().toString(36).substr(2, 9),
        type: selectedType,
        position: [xPos, yPos, zPos],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        color: colors[selectedType],
        dimensions,
      });
    }
    setShowMeasurements(false);
    setSelectedType(null);
  };

  const handleResetRotation = () => {
    if (selectedItemId) {
      const item = items.find(i => i.id === selectedItemId);
      if (item) {
        updateItem(selectedItemId, {
          ...item,
          rotation: [0, 0, 0]
        });
      }
    }
  };

  return (
    <>
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg mb-4">
          <h3 className="text-white text-sm mb-2">Kitchen Dimensions</h3>
          <p className="text-white/80 text-xs">
            Width: {boundary.width}m<br />
            Height: {boundary.height}m<br />
            Depth: {boundary.depth}m
          </p>
        </div>

        <div className="flex flex-col gap-2 bg-white/10 backdrop-blur-sm p-4 rounded-lg">
          <button
            onClick={() => handleAddClick('cabinet')}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} /> Add Cabinet
          </button>
          <button
            onClick={() => handleAddClick('countertop')}
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} /> Add Countertop
          </button>
          <button
            onClick={() => handleAddClick('appliance')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} /> Add Appliance
          </button>
        </div>
        
        {selectedItemId && (
          <div className="flex flex-col gap-2 bg-white/10 backdrop-blur-sm p-4 rounded-lg">
            <button
              onClick={handleResetRotation}
              className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-lg flex items-center gap-2"
            >
              <RotateCcw size={20} /> Reset Rotation
            </button>
            <button
              onClick={() => removeItem(selectedItemId)}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg flex items-center gap-2"
            >
              <Trash size={20} /> Remove Selected
            </button>
          </div>
        )}

        <div className="flex flex-col gap-2 bg-white/10 backdrop-blur-sm p-4 rounded-lg mt-4">
          <button
            onClick={handleExport}
            className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-lg flex items-center gap-2"
          >
            <Download size={20} /> Export Layout
          </button>

          <label className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-lg flex items-center gap-2 cursor-pointer">
            <Upload size={20} /> Import Layout
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {showMeasurements && selectedType && (
        <MeasurementsDialog
          type={selectedType}
          onSubmit={handleMeasurementsSubmit}
          onCancel={() => {
            setShowMeasurements(false);
            setSelectedType(null);
          }}
        />
      )}
    </>
  );
}
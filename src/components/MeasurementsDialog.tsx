import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Props {
  type: 'cabinet' | 'countertop' | 'appliance';
  onSubmit: (dimensions: { width: number; height: number; depth: number }) => void;
  onCancel: () => void;
}

const defaultDimensions = {
  cabinet: { width: 0.6, height: 0.8, depth: 0.6 },
  countertop: { width: 0.6, height: 0.04, depth: 0.6 },
  appliance: { width: 0.6, height: 0.85, depth: 0.6 },
};

const recommendations = {
  cabinet: {
    width: '0.3m - 1.2m',
    height: '0.8m (base) or 0.6m-0.9m (wall)',
    depth: '0.6m standard',
  },
  countertop: {
    width: 'Match cabinet width',
    height: '0.04m standard',
    depth: '0.6m standard',
  },
  appliance: {
    width: '0.6m standard',
    height: '0.85m standard',
    depth: '0.6m standard',
  },
};

export function MeasurementsDialog({ type, onSubmit, onCancel }: Props) {
  const [dimensions, setDimensions] = useState(defaultDimensions[type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(dimensions);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[450px] max-w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold capitalize">{type} Measurements</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Width (meters)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.3"
                max="2"
                value={dimensions.width}
                onChange={(e) =>
                  setDimensions({ ...dimensions, width: parseFloat(e.target.value) })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Recommended: {recommendations[type].width}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Height (meters)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.04"
                max="2.4"
                value={dimensions.height}
                onChange={(e) =>
                  setDimensions({ ...dimensions, height: parseFloat(e.target.value) })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Recommended: {recommendations[type].height}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Depth (meters)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.3"
                max="1"
                value={dimensions.depth}
                onChange={(e) =>
                  setDimensions({ ...dimensions, depth: parseFloat(e.target.value) })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Recommended: {recommendations[type].depth}
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
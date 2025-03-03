import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useKitchenStore } from '../store';

interface Props {
  onComplete: () => void;
}

export function LayoutConfig({ onComplete }: Props) {
  const setBoundary = useKitchenStore((state) => state.setBoundary);
  const [dimensions, setDimensions] = useState({
    width: 4,
    height: 2.4,
    depth: 3,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBoundary(dimensions);
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-[500px] max-w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Kitchen Layout Configuration</h2>
          <button onClick={onComplete} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Room Dimensions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width (meters)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="2"
                  max="10"
                  value={dimensions.width}
                  onChange={(e) =>
                    setDimensions({ ...dimensions, width: parseFloat(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (meters)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="2"
                  max="4"
                  value={dimensions.height}
                  onChange={(e) =>
                    setDimensions({ ...dimensions, height: parseFloat(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Depth (meters)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="2"
                  max="10"
                  value={dimensions.depth}
                  onChange={(e) =>
                    setDimensions({ ...dimensions, depth: parseFloat(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Designing
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Recommendations:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Standard room height is 2.4m</li>
            <li>• Minimum kitchen width should be 2m</li>
            <li>• Recommended depth is 2.5-3m for comfortable movement</li>
            <li>• Consider space for door opening (usually 0.9m)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
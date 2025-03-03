import React from 'react';
import { useKitchenStore } from '../store';
import { KITCHEN_ITEM_DEFINITIONS } from '../types';

export function KitchenDiagram() {
  const items = useKitchenStore((state) => state.items);
  const boundary = useKitchenStore((state) => state.boundary);
  const fixtures = useKitchenStore((state) => state.fixtures);
  const selectedItemId = useKitchenStore((state) => state.selectedItemId);
  const setSelectedItem = useKitchenStore((state) => state.setSelectedItem);

  // Scale factors for the diagram
  const scale = 40; // pixels per meter
  const width = boundary.width * scale;
  const depth = boundary.depth * scale;

  // Convert 3D coordinates to 2D diagram coordinates
  const toScreenX = (x: number) => (x + boundary.width / 2) * scale;
  const toScreenY = (z: number) => (z + boundary.depth / 2) * scale;

  return (
    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-3">Top-Down View</h3>
      <div 
        className="relative border-2 border-gray-300 bg-gray-100"
        style={{ width: `${width}px`, height: `${depth}px` }}
      >
        {/* Fixtures (doors, windows) */}
        {fixtures.map((fixture, index) => {
          const x = toScreenX(fixture.position[0]);
          const y = toScreenY(fixture.position[2]);
          const fixtureWidth = fixture.dimensions.width * scale;
          const fixtureDepth = fixture.dimensions.depth * scale;
          
          return (
            <div
              key={`fixture-${index}`}
              className={`absolute rounded ${fixture.type === 'door' ? 'bg-yellow-300/70' : 'bg-blue-300/70'}`}
              style={{
                left: `${x - fixtureWidth / 2}px`,
                top: `${y - fixtureDepth / 2}px`,
                width: `${fixtureWidth}px`,
                height: `${fixtureDepth}px`,
                transform: `rotate(${fixture.rotation[1]}rad)`,
                transformOrigin: 'center',
              }}
            >
              <div className="text-xs font-semibold text-center">
                {fixture.type}
              </div>
            </div>
          );
        })}

        {/* Kitchen items */}
        {items.map((item) => {
          const x = toScreenX(item.position[0]);
          const y = toScreenY(item.position[2]);
          const itemWidth = item.dimensions.width * scale;
          const itemDepth = item.dimensions.depth * scale;
          
          // Get color based on item type
          let bgColor;
          switch (item.type) {
            case 'cabinet':
              bgColor = 'bg-amber-700/80';
              break;
            case 'countertop':
              bgColor = 'bg-gray-400/80';
              break;
            case 'appliance':
              bgColor = 'bg-zinc-500/80';
              break;
            default:
              bgColor = 'bg-gray-500/80';
          }

          // Add border for selected item
          const borderClass = selectedItemId === item.id 
            ? 'border-2 border-red-500' 
            : 'border border-gray-600';

          return (
            <div
              key={item.id}
              className={`absolute rounded ${bgColor} ${borderClass} cursor-pointer hover:opacity-80 transition-opacity`}
              style={{
                left: `${x - itemWidth / 2}px`,
                top: `${y - itemDepth / 2}px`,
                width: `${itemWidth}px`,
                height: `${itemDepth}px`,
                transform: `rotate(${item.rotation[1]}rad)`,
                transformOrigin: 'center',
              }}
              onClick={() => setSelectedItem(item.id)}
            >
              <div className="text-xs font-semibold text-white text-center truncate p-1">
                {item.label || item.type}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-700/80 rounded"></div>
          <span>Cabinet</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-400/80 rounded"></div>
          <span>Countertop</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-zinc-500/80 rounded"></div>
          <span>Appliance</span>
        </div>
      </div>
    </div>
  );
}
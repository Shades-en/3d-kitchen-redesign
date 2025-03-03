import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Refrigerator, Pen as Oven, CookingPot, Coffee } from 'lucide-react';
import { KitchenItem } from '../types';
import { useKitchenStore } from '../store';
import { KITCHEN_ITEM_DEFINITIONS } from '../types';

interface Props {
  onSelectItem: (type: KitchenItem['type'], position: { x: number, y: number }) => void;
}

interface ItemCategory {
  title: string;
  items: {
    key: string;
    name: string;
    type: KitchenItem['type'];
    icon: React.ReactNode;
    description: string;
    defaultDimensions: {
      width: number;
      height: number;
      depth: number;
    };
    color: string;
    modelUrl?: string;
  }[];
}

// Organize items into categories
const categories: ItemCategory[] = [
  {
    title: 'Appliances',
    items: [
      {
        key: 'refrigerator',
        name: 'Refrigerator',
        type: 'appliance',
        icon: <Refrigerator className="w-8 h-8" />,
        description: 'Standard size refrigerator',
        defaultDimensions: KITCHEN_ITEM_DEFINITIONS['refrigerator'].defaultDimensions,
        color: KITCHEN_ITEM_DEFINITIONS['refrigerator'].color,
        modelUrl: KITCHEN_ITEM_DEFINITIONS['refrigerator'].modelUrl
      },
      {
        key: 'oven',
        name: 'Oven',
        type: 'appliance',
        icon: <Oven className="w-8 h-8" />,
        description: 'Built-in electric oven',
        defaultDimensions: KITCHEN_ITEM_DEFINITIONS['oven'].defaultDimensions,
        color: KITCHEN_ITEM_DEFINITIONS['oven'].color,
        modelUrl: KITCHEN_ITEM_DEFINITIONS['oven'].modelUrl
      },
      {
        key: 'cooktop',
        name: 'Cooktop',
        type: 'appliance',
        icon: <CookingPot className="w-8 h-8" />,
        description: '4-burner gas cooktop',
        defaultDimensions: KITCHEN_ITEM_DEFINITIONS['cooktop'].defaultDimensions,
        color: KITCHEN_ITEM_DEFINITIONS['cooktop'].color,
        modelUrl: KITCHEN_ITEM_DEFINITIONS['cooktop'].modelUrl
      },
      {
        key: 'dishwasher',
        name: 'Dishwasher',
        type: 'appliance',
        icon: <Coffee className="w-8 h-8" />,
        description: 'Built-in dishwasher',
        defaultDimensions: KITCHEN_ITEM_DEFINITIONS['dishwasher'].defaultDimensions,
        color: KITCHEN_ITEM_DEFINITIONS['dishwasher'].color,
        modelUrl: KITCHEN_ITEM_DEFINITIONS['dishwasher'].modelUrl
      }
    ]
  },
  {
    title: 'Storage',
    items: [
      {
        key: 'base-cabinet',
        name: 'Base Cabinet',
        type: 'cabinet',
        icon: <div className="w-8 h-8 border-2 border-current rounded" />,
        description: 'Standard base cabinet',
        defaultDimensions: KITCHEN_ITEM_DEFINITIONS['base-cabinet'].defaultDimensions,
        color: KITCHEN_ITEM_DEFINITIONS['base-cabinet'].color,
        modelUrl: KITCHEN_ITEM_DEFINITIONS['base-cabinet'].modelUrl
      },
      {
        key: 'wall-cabinet',
        name: 'Wall Cabinet',
        type: 'cabinet',
        icon: <div className="w-8 h-8 border-2 border-current rounded-t" />,
        description: 'Wall-mounted cabinet',
        defaultDimensions: KITCHEN_ITEM_DEFINITIONS['wall-cabinet'].defaultDimensions,
        color: KITCHEN_ITEM_DEFINITIONS['wall-cabinet'].color,
        modelUrl: KITCHEN_ITEM_DEFINITIONS['wall-cabinet'].modelUrl
      }
    ]
  },
  {
    title: 'Work Surfaces',
    items: [
      {
        key: 'countertop',
        name: 'Countertop',
        type: 'countertop',
        icon: <div className="w-8 h-2 bg-current rounded" />,
        description: 'Standard kitchen countertop',
        defaultDimensions: KITCHEN_ITEM_DEFINITIONS['countertop'].defaultDimensions,
        color: KITCHEN_ITEM_DEFINITIONS['countertop'].color,
        modelUrl: KITCHEN_ITEM_DEFINITIONS['countertop'].modelUrl
      }
    ]
  }
];

export function ItemsDrawer({ onSelectItem }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const addItem = useKitchenStore((state) => state.addItem);
  const boundary = useKitchenStore((state) => state.boundary);

  const handleDragStart = (e: React.DragEvent, itemKey: string, itemType: KitchenItem['type']) => {
    e.dataTransfer.setData('text/plain', itemKey);
    setDraggedItem(itemKey);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleItemClick = (itemKey: string) => {
    const itemDef = KITCHEN_ITEM_DEFINITIONS[itemKey];
    if (!itemDef) return;

    // Place item at a valid position within the kitchen boundary
    const yPos = itemDef.floorPlacement ? 0 : 0.9;
    const xPos = Math.min(itemDef.defaultDimensions.width / 2, boundary.width / 2 - itemDef.defaultDimensions.width);
    const zPos = Math.min(itemDef.defaultDimensions.depth / 2, boundary.depth / 2 - itemDef.defaultDimensions.depth);

    addItem({
      id: Math.random().toString(36).substr(2, 9),
      type: itemDef.type,
      position: [xPos, yPos, zPos],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: itemDef.color,
      dimensions: itemDef.defaultDimensions,
      modelUrl: itemDef.modelUrl,
      label: itemDef.label
    });
  };

  return (
    <div 
      className={`fixed left-0 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-r-xl shadow-lg transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full bg-white/90 backdrop-blur-sm p-2 rounded-r-xl shadow-lg"
      >
        {isOpen ? <ChevronLeft /> : <ChevronRight />}
      </button>

      <div className="w-80 max-h-[80vh] overflow-y-auto p-4">
        <h2 className="text-xl font-bold mb-4">Kitchen Items</h2>
        
        {categories.map((category, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-semibold mb-3">{category.title}</h3>
            <div className="space-y-2">
              {category.items.map((item) => (
                <div
                  key={item.key}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.key, item.type)}
                  onDragEnd={handleDragEnd}
                  onClick={() => handleItemClick(item.key)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-black/5 transition-colors text-left group cursor-move ${
                    draggedItem === item.key ? 'opacity-50' : ''
                  }`}
                >
                  <div className="text-gray-700 group-hover:text-gray-900">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import { create } from 'zustand';
import {
  KitchenState,
  KitchenItem,
  KitchenBoundary,
  FixedFixture,
} from './types';

const DEFAULT_BOUNDARY: KitchenBoundary = {
  width: 4,
  height: 2.4,
  depth: 3,
};

const DEFAULT_FIXTURES: FixedFixture[] = [
  {
    type: 'door',
    position: [2, 1.1, 1.5],
    rotation: [0, Math.PI / 2, 0],
    dimensions: {
      width: 0.9,
      height: 2.2,
      depth: 0.1,
    },
  },
  {
    type: 'window',
    position: [2, 1.5, 0],
    rotation: [0, Math.PI / 2, 0],
    dimensions: {
      width: 1.2,
      height: 1,
      depth: 0.1,
    },
  },
];

export const useKitchenStore = create<KitchenState>((set) => ({
  items: [],
  selectedItemId: null,
  boundary: DEFAULT_BOUNDARY,
  fixtures: DEFAULT_FIXTURES,
  addItem: (item) => {
    let modelPath = '';
    if (item.type == 'appliance') {
      modelPath = 'src/assets/fridge.glb';
    } else if (item.type == 'countertop') {
      modelPath = 'src/assets/countertop.glb';
    } else {
      modelPath = 'src/assets/cabinet.glb';
    }
    item.modelPath = modelPath;
    set((state) => ({ items: [...state.items, item] }));
  },
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    })),
  setSelectedItem: (id) => set({ selectedItemId: id }),
  importLayout: (items) => set({ items }),
  setBoundary: (boundary) => set({ boundary }),
}));

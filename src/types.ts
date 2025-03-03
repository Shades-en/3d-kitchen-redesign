export interface KitchenBoundary {
  width: number;
  height: number;
  depth: number;
}

export interface FixedFixture {
  type: 'door' | 'window';
  position: [number, number, number];
  rotation: [number, number, number];
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
}

export interface KitchenItem {
  id: string;
  type: 'cabinet' | 'countertop' | 'appliance';
  modelPath: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
}

export interface KitchenState {
  items: KitchenItem[];
  selectedItemId: string | null;
  boundary: KitchenBoundary;
  fixtures: FixedFixture[];
  addItem: (item: KitchenItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<KitchenItem>) => void;
  setSelectedItem: (id: string | null) => void;
  importLayout: (items: KitchenItem[]) => void;
  setBoundary: (boundary: KitchenBoundary) => void;
}

import { create } from "zustand";

// Define the property schema
interface Property {
  id: string;
  name: string;
  location?: string;
  [key: string]: any; // Allow additional dynamic fields
}

interface PropertyState {
  userLat: number | null;
  userLong: number | null;
  properties: Record<string, Property>; // Stores properties by ID
  setUserLocation: (lat: number, long: number) => void;
  addProperty: (id: string, newProperty: Property) => void;
  removeProperty: (id: string) => void;
}

// Zustand Store
export const usePropertyStore = create<PropertyState>((set) => ({
  userLat: null,
  userLong: null,
  properties: {},

  setUserLocation: (lat, long) => set({ userLat: lat, userLong: long }),

  addProperty: (id, newProperty) =>
    set((state) => ({
      properties: { ...state.properties, [id]: newProperty },
    })),

  removeProperty: (id) =>
    set((state) => {
      const newProperties = { ...state.properties };
      delete newProperties[id];
      return { properties: newProperties };
    }),
}));

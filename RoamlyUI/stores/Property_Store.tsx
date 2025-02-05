import { create } from "zustand";

// Zustand Store
export const usePropertyStore = create((set) => ({
  property: "Default Property",
  // Define properties as a Record with string keys and propertySchema as values
  properties: {},
  userLat: null,
  userLong: null,

  setProperty: (property) => set({ property }),

  // Add a property by using an object key-value pair
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

import { create } from "zustand";
import { propertiesSchema, propertySchema } from "@/schemas/property-data";

// ToDo: Need to enforce zustand store validation for the schemas
// once we finalize the property values and information

// Zustand Store
export const usePropertyStore = create((set) => ({
  property: "Default Property",
  properties: [],
  userLat: null,
  userLong: null,

  setProperty: (property) => set({ property }),

  addProperty: (newProperty) =>
    set((state) => ({
      properties: [...state.properties, newProperty],
    })),

  removeProperty: (id) =>
    set((state) => ({
      properties: state.properties.filter((prop) => prop.id !== id),
    })),
}));

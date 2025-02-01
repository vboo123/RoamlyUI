import { create } from "zustand";
import { propertiesSchema } from "@/schemas/propety-data";
import { propertySchema } from "@/schemas/propety-data";

// Zustand Store with Schema Validation
export const usePropertyStore = create((set) => ({
  property: "Default Property",
  properties: [],

  setProperty: (property) => set({ property }),

  addProperty: (newProperty) =>
    set((state) => {
      const parsed = propertySchema.safeParse(newProperty);
      return parsed.success
        ? { properties: [...state.properties, parsed.data] }
        : state;
    }),

  removeProperty: (id) =>
    set((state) => ({
      properties: state.properties.filter((prop) => prop.id !== id),
    })),
}));

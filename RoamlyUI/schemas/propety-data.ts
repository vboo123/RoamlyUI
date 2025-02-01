import { z } from "zod";

// Define the Property Schema using Zod
export const propertySchema = z.object({
  propertyName: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  content: z.string(),
});

// Define the Properties Array Schema
export const propertiesSchema = z.array(propertySchema);

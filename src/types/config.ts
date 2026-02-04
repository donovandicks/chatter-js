import { z } from "zod";

export const settingsSchema = z.object({
  maxTurns: z.number().default(10),
});

export type ChatterSettings = z.infer<typeof settingsSchema>;

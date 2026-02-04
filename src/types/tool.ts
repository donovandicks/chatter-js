import { z } from "zod";

export const toolSchema = z.object({
  name: z.string(),
  description: z.string(),
  inputSchema: z.record(z.string(), z.any()),
  function: z.function({
    input: [z.any()],
    output: z.string().or(z.promise(z.string())),
  }),
});
export type ToolSchema = z.infer<typeof toolSchema>;

import z from "zod";
import { ToolSchema } from "../types/tool.ts";

const readFileParams = z.object({
  path: z.string().describe("The relative path of a file in the working directory."),
});
type ReadFileParams = z.infer<typeof readFileParams>;

export const ReadFileTool = {
  name: "read_file",
  desc:
    "Read the contents of a given relative file path. Use this when you want to see what's inside a file. Cannot be used with directory names.",
  inputSchema: z.toJSONSchema(readFileParams),
  function: readFile,
} satisfies ToolSchema;

export function readFile({ path }: ReadFileParams): string {
  if (!path) {
    return "Error: 'path' must be defined'";
  }

  try {
    return Deno.readTextFileSync(path);
  } catch (error) {
    return `Error: failed to read file ${path}: ${error}`;
  }
}

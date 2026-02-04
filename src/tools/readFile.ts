import z from "zod";
import { ToolSchema } from "../types/tool.ts";
import { existsSync } from "@std/fs";
import { checkPathWithinCurrentDir } from "./utils/checkCurrentDirectory.ts";

const readFileParams = z.object({
  path: z.string().describe("The relative path of a file in the working directory."),
});
type ReadFileParams = z.infer<typeof readFileParams>;

export const ReadFileTool = {
  name: "read_file",
  description:
    "Read the contents of a given relative file path. Use this when you want to see what's inside a file. Cannot be used with directory names.",
  inputSchema: z.toJSONSchema(readFileParams),
  function: readFile,
} satisfies ToolSchema;

export function readFile({ path }: ReadFileParams): string {
  if (!path) {
    return "Error: 'path' must be defined.";
  }

  if (!checkPathWithinCurrentDir(path)) {
    return "Error: provided path is outside of the working directory.";
  }

  if (!existsSync(path)) {
    return `Error: ${path} does not exist.`;
  }

  try {
    return Deno.readTextFileSync(path);
  } catch (error) {
    return `Error: failed to read file ${path}: ${error}`;
  }
}

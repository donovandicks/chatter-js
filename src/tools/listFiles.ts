import z from "zod";
import { ToolSchema } from "../types/tool.ts";
import { checkPathWithinCurrentDir } from "./utils/checkCurrentDirectory.ts";

const listFilesParams = z.object({
  path: z.string().describe(
    "The relative path of a directory in the working directory. Use '.' to reference the current working directory.",
  ),
});
type ListFilesParams = z.infer<typeof listFilesParams>;

export const ListFilesTool = {
  name: "list_files",
  description:
    "List the files in a given relative directory path. Use this when you want to see what's inside a directory. Cannot be used with file names.",
  inputSchema: z.toJSONSchema(listFilesParams),
  function: listFiles,
} satisfies ToolSchema;

export function listFiles({ path }: ListFilesParams): string {
  const dir = path || ".";

  if (!checkPathWithinCurrentDir(dir)) {
    return "Error: provided path is outside of the working directory.";
  }

  const files = [];
  const dirs = [];
  for (const entry of Deno.readDirSync(dir)) {
    if (entry.isDirectory) dirs.push(`${entry.name}/`);
    if (entry.isFile) files.push(`${entry.name}`);
  }

  if (!files.length && !dirs.length) {
    return "Directory is empty";
  }

  let response = "# Directory Contents";
  if (files.length) {
    response += `\n\n## Files\n\n- ${files.join("\n- ")}`;
  }
  if (dirs.length) {
    response += `\n\n## Directories\n\n- ${dirs.join("\n- ")}`;
  }

  return response;
}

import z from "zod";
import { ToolSchema } from "../types/tool.ts";
import { existsSync } from "@std/fs";

const editFileParams = z.object({
  path: z.string().describe("The relative path of a file in the working directory."),
  prev: z.string().describe("The original text to replace. Must have one and only one exact match."),
  edit: z.string().describe("The new text to replace `prev` with."),
});
type EditFileParams = z.infer<typeof editFileParams>;

export const EditFileTool = {
  name: "edit_file",
  desc: `Make edits to a file.
Replaces "prev" with "edit". "prev" and "edit" MUST be different.
If the file does not exist, it will be created.
`,
  inputSchema: z.toJSONSchema(editFileParams),
  function: editFile,
} satisfies ToolSchema;

export function editFile({ path, prev, edit }: EditFileParams): string {
  if (!path) {
    return "Error: 'path' must be defined.";
  }

  if (prev === edit) {
    return "Error: 'prev' and 'edit' must be different.";
  }

  if (!existsSync(path)) {
    Deno.writeTextFileSync(path, edit);
    return "OK";
  }

  const existing = Deno.readTextFileSync(path);
  const matches = existing.match(prev);
  if (!matches || matches.length > 1) {
    return `Error: expecting 1 match for 'prev', found ${matches?.length || 0}`;
  }

  Deno.writeTextFileSync(path, existing.replace(prev, edit));
  return "OK";
}

import { ToolSchema } from "../types/tool.ts";
import { EditFileTool } from "./editFile.ts";
import { ListFilesTool } from "./listFiles.ts";
import { ReadFileTool } from "./readFile.ts";

export const ToolRegistry: Record<string, ToolSchema> = {
  [ReadFileTool.name]: ReadFileTool,
  [ListFilesTool.name]: ListFilesTool,
  [EditFileTool.name]: EditFileTool,
};

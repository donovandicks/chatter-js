import { ToolSchema } from "../types/tool.ts";
import { ListFilesTool } from "./listFiles.ts";
import { ReadFileTool } from "./readFile.ts";

export const ToolRegistry: Record<string, ToolSchema> = {
  [ReadFileTool.name]: ReadFileTool,
  [ListFilesTool.name]: ListFilesTool,
};

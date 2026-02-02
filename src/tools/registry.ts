import { ToolSchema } from "../types/tool.ts";
import { ReadFileTool } from "./readFile.ts";

export const ToolRegistry: Record<string, ToolSchema> = {
  read_file: ReadFileTool,
};

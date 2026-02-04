import { ChatterSettings, settingsSchema } from "../types/config.ts";
import { extname } from "@std/path";
import * as YAML from "@std/yaml";
import z, { ZodError } from "zod";

const defaultSettingsPath = "./.chatter/settings.yaml";

function deserializeSettingsFile(raw: string, type: "json" | "yaml"): object {
  switch (type) {
    case "json":
      return JSON.parse(raw);
    case "yaml":
      return YAML.parse(raw) as object;
    default:
      throw new Error(`Cannot parse settings of type ${type}`);
  }
}

function determineSettingsType(ext: string): "json" | "yaml" {
  switch (ext) {
    case ".yml":
    case ".yaml":
      return "yaml";
    case ".json":
      return "json";
    default:
      throw new Error(`Unknown settings file type ${ext}`);
  }
}

export function loadSettings(path: string = defaultSettingsPath): ChatterSettings {
  let settingsFile = "";

  try {
    settingsFile = Deno.readTextFileSync(path);
  } catch (_) {
    throw new Error(`Failed to load settings file at ${path}`);
  }

  const fileType = determineSettingsType(extname(path));
  const settingsObject = deserializeSettingsFile(settingsFile, fileType);

  try {
    return settingsSchema.parse(settingsObject);
  } catch (error) {
    throw new Error(z.prettifyError(error as ZodError));
  }
}

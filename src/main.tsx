import "@std/dotenv/load";
import { parseArgs } from "@std/cli";

import { render } from "ink";
import { Chat } from "./components/Chat.tsx";
import { ChatService } from "./services/chatService.ts";
import { loadSettings } from "./config/loader.ts";
import { ChatterSettings } from "./types/config.ts";

type Args = {
  configPath?: string;
  noninteractivePrompt?: string;
};

function parseCliArgs(): Args {
  const args = parseArgs(Deno.args, {
    "string": ["config"],
  });

  const positionalArgument = args._[0];

  return {
    configPath: args.config,
    noninteractivePrompt: positionalArgument ? `${positionalArgument}` : undefined,
  };
}

async function handleNoninteractive(settings: ChatterSettings, prompt: string) {
  const chatService = new ChatService({
    maxTurns: settings.maxTurns,
    onEvent: (event) => {
      if (event.displayText) {
        console.log(`[${event.type}] ${event.displayText}`);
      }
    },
  });
  const response = await chatService.sendMessage(prompt);
  console.log(response);
}

function handleInteractive(settings: ChatterSettings) {
  // Clear screen to give a full-screen app feel
  console.clear();
  render(<Chat settings={settings} />);
}

async function main() {
  const args = parseCliArgs();
  let settings: ChatterSettings | undefined = undefined;

  try {
    settings = loadSettings(args.configPath);
  } catch (error) {
    console.error("%cFailed to load settings:", "color: red");
    console.error(`%c${(error as Error).message}`, "color: red");
    Deno.exit(1);
  }

  if (args.noninteractivePrompt) {
    await handleNoninteractive(settings, args.noninteractivePrompt);
    Deno.exit(0);
  }

  handleInteractive(settings);
}

if (import.meta.main) {
  await main();
}

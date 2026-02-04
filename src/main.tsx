import "@std/dotenv/load";

import { render } from "ink";
import { Chat } from "./components/Chat.tsx";
import { ChatService } from "./services/chatService.ts";

async function handleNoninteractive(prompt: string) {
  const chatService = new ChatService({
    onEvent: (event) => {
      if (event.displayText) {
        console.log(`[${event.type}] ${event.displayText}`);
      }
    },
  });
  const response = await chatService.sendMessage(prompt);
  console.log(response);
}

function handleInteractive() {
  // Clear screen to give a full-screen app feel
  console.clear();
  render(<Chat />);
}

async function main() {
  const prompt = Deno.args[0];
  if (prompt) {
    await handleNoninteractive(prompt);
    Deno.exit(0);
  }

  handleInteractive();
}

if (import.meta.main) {
  await main();
}

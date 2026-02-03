import "@std/dotenv/load";
import { render } from "ink";
import { Chat } from "./components/Chat.tsx";
import { ChatService } from "./services/chatService.ts";

if (import.meta.main) {
  const prompt = Deno.args[0];
  if (prompt) {
    const chatService = new ChatService({
      onEvent: (event) => {
        if (event.displayText) {
          console.log(`[${event.type}] ${event.displayText}`);
        }
      },
    });
    const response = await chatService.sendMessage(prompt);
    console.log(response);
    Deno.exit(0);
  }

  // Clear screen to give a full-screen app feel
  console.clear();
  render(<Chat />);
}

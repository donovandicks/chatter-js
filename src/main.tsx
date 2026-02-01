import "@std/dotenv/load";
import { render } from "ink";
import { Chat } from "./components/Chat.tsx";

if (import.meta.main) {
  // Clear screen to give a full-screen app feel
  console.clear();
  render(<Chat />);
}

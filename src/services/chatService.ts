import { Message } from "../types/chat.ts";
import { geminiAgent } from "./gemini.ts";

export class ChatService {
  async sendMessage(
    content: string,
    history: Message[],
  ): Promise<Message> {
    const responseText = await geminiAgent.generateResponse(history, content);

    return {
      id: (Date.now() + 1).toString(),
      content: responseText,
      sender: "system",
    };
  }

  createUserMessage(content: string): Message {
    return {
      id: Date.now().toString(),
      content,
      sender: "user",
    };
  }
}

export const chatService = new ChatService();

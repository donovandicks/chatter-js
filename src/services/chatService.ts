import { Message } from "../types/chat.ts";
import { geminiAgent } from "./gemini.ts";

const messageId = () => Temporal.Now.instant().epochMilliseconds;

export class ChatService {
  async sendMessage(content: string): Promise<Message> {
    const responseText = await geminiAgent.generateResponse(content);

    return {
      id: messageId(),
      content: responseText,
      sender: "system",
    };
  }

  createUserMessage(content: string): Message {
    return {
      id: messageId(),
      content,
      sender: "user",
    };
  }
}

export const chatService = new ChatService();

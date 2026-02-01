import { Message } from "../types/chat.ts";

export class ChatService {
  async sendMessage(
    content: string,
    _history: Message[],
  ): Promise<Message> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      id: (Date.now() + 1).toString(),
      content: `You said: "${content}"`,
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

import { Message } from "../types/chat.ts";
import { GeminiAgent } from "./gemini.ts";
import { ChatOptions } from "../types/chat.ts";
import { ToolRegistry } from "../tools/registry.ts";

const messageId = () => Temporal.Now.instant().epochMilliseconds;

export class ChatService {
  private agent: GeminiAgent;

  constructor(options: ChatOptions) {
    this.agent = new GeminiAgent({
      ...options,
      tools: options.tools || Object.values(ToolRegistry),
    });
  }

  async sendMessage(content: string): Promise<Message> {
    const responseText = await this.agent.run(content);

    return {
      id: messageId(),
      content: responseText,
      sender: "system",
      variant: "text",
    };
  }

  createUserMessage(content: string): Message {
    return {
      id: messageId(),
      content,
      sender: "user",
      variant: "text",
    };
  }
}

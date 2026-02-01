import { Chat, Content, GoogleGenAI } from "@google/genai";

const Models = {
  Gemini3Pro: "gemini-3-pro-preview",
  Gemini3Flash: "gemini-3-flash-preview",
} as const;

export class GeminiAgent {
  private history: Content[] = [];
  private client: GoogleGenAI;
  private chat: Chat;

  constructor() {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set in the environment variables.");
    }
    this.client = new GoogleGenAI({ apiKey: apiKey || "" });
    this.chat = this.client.chats.create({
      model: Models.Gemini3Flash,
      history: this.history,
      config: {
        tools: [
          { googleSearch: {} },
          { urlContext: {} },
        ],
      },
    });
  }

  async generateResponse(newMessage: string): Promise<string> {
    try {
      const response = await this.chat.sendMessage({
        "message": newMessage,
      });

      if (response.text) {
        return response.text;
      }

      return "Error: No text in response.";
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return "Error: Unable to reach the AI agent. Please check your API key and internet connection.";
    }
  }
}

export const geminiAgent = new GeminiAgent();

import { GoogleGenAI } from "@google/genai";
import { Message } from "../types/chat.ts";

const Models = {
  Gemini3Pro: "gemini-3-pro-preview",
  Gemini3Flash: "gemini-3-flash-preview",
} as const;

export class GeminiAgent {
  private client: GoogleGenAI;

  constructor() {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set in the environment variables.");
    }
    this.client = new GoogleGenAI({ apiKey: apiKey || "" });
  }

  async generateResponse(history: Message[], newMessage: string): Promise<string> {
    try {
      // Convert internal Message format to Gemini SDK format
      const contents = history.map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

      // Add the new user message
      contents.push({
        role: "user",
        parts: [{ text: newMessage }],
      });

      const response = await this.client.models.generateContent({
        model: Models.Gemini3Flash,
        contents: contents,
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

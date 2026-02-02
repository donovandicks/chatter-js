import {
  Chat,
  Content,
  FunctionCall,
  GenerateContentResponse,
  GoogleGenAI,
  PartListUnion,
  ToolListUnion,
  ToolUnion,
} from "@google/genai";
import { ToolSchema } from "../types/tool.ts";
import { ToolRegistry } from "../tools/registry.ts";
import { tracer } from "../o11y/tracing.ts";
import { SpanStatusCode } from "@opentelemetry/api";

const Models = {
  Gemini3Pro: "gemini-3-pro-preview",
  Gemini3Flash: "gemini-3-flash-preview",
} as const;

function toolSchemaToGeminiTool(ts: ToolSchema): ToolUnion {
  return {
    functionDeclarations: [
      {
        name: ts.name,
        description: ts.desc,
        parametersJsonSchema: ts.inputSchema,
      },
    ],
  };
}

export class GeminiAgent {
  private history: Content[] = [];
  private client: GoogleGenAI;
  private chat: Chat;
  private tools: ToolListUnion = [
    // { googleSearch: {} },
    // { urlContext: {} },
  ];

  constructor(tools?: ToolSchema[]) {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in the environment variables.");
    }

    if (tools && tools.length) {
      this.tools.push(...tools.map((t) => toolSchemaToGeminiTool(t)));
    }

    this.client = new GoogleGenAI({ apiKey });
    this.chat = this.client.chats.create({
      model: Models.Gemini3Flash,
      history: this.history,
      config: {
        tools: this.tools,
      },
    });
  }

  async sendMessage(message: PartListUnion): Promise<GenerateContentResponse> {
    return await tracer.startActiveSpan("chat", async (span) => {
      try {
        span.setAttribute("message", typeof message !== "string" ? JSON.stringify(message) : message);
        return await this.chat.sendMessage({ message });
      } catch (error) {
        span.recordException(error as Error);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: (error as Error).message,
        });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  async generateResponse(newMessage: string): Promise<string> {
    try {
      let response = await this.sendMessage(newMessage);

      if (response.functionCalls && response.functionCalls.length > 0) {
        const fc = response.functionCalls[0];
        const result = await this.executeTool(fc);
        response = await this.sendMessage({
          functionResponse: {
            name: fc.name,
            response: { result },
          },
        });
      }

      if (response.text) {
        return response.text;
      }

      return "Error: No text in response.";
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return "Error: Unable to reach the AI agent. Please check your API key and internet connection.";
    }
  }

  async executeTool({ name, args }: FunctionCall) {
    const tool = ToolRegistry[name! as keyof typeof ToolRegistry];
    if (!tool) {
      return `Error: tool ${name} not found`;
    }

    return await tool.function(args!);
  }
}

export const geminiAgent = new GeminiAgent([ToolRegistry.read_file]);

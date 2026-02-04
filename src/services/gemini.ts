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
import { SpanStatusCode, trace } from "@opentelemetry/api";
import { EventPayload, EventType } from "../types/event.ts";
import { ChatOptions } from "../types/chat.ts";
import { GeminiAPIKey, MaxTurns } from "../config/ai.ts";
import { SystemPrompt } from "../config/systemPrompt.ts";

const Models = {
  Gemini3Pro: "gemini-3-pro-preview",
  Gemini3Flash: "gemini-3-flash-preview",
} as const;

function toolSchemaToGeminiTool(ts: ToolSchema): ToolUnion {
  return {
    functionDeclarations: [
      {
        name: ts.name,
        description: ts.description,
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
  private onEvent: (event: EventPayload) => void;

  constructor({ tools, onEvent }: ChatOptions) {
    this.onEvent = onEvent;
    if (!GeminiAPIKey) {
      throw new Error("GEMINI_API_KEY is not set in the environment.");
    }

    if (tools && tools.length) {
      this.tools.push(...tools.map((t) => toolSchemaToGeminiTool(t)));
    }

    this.client = new GoogleGenAI({ apiKey: GeminiAPIKey });
    this.chat = this.client.chats.create({
      model: Models.Gemini3Flash,
      history: this.history,
      config: {
        systemInstruction: SystemPrompt,
        tools: this.tools,
      },
    });
  }

  async sendMessage(message: PartListUnion): Promise<GenerateContentResponse> {
    return await tracer.startActiveSpan("chat", async (span) => {
      try {
        span.setAttribute("chat.message", typeof message !== "string" ? JSON.stringify(message) : message);
        const response = await this.chat.sendMessage({ message });
        span.setAttribute(
          "chat.response",
          JSON.stringify({
            text: response.text,
            functionCalls: response.functionCalls,
            usage: response.usageMetadata,
          }),
        );
        return response;
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

  async executeTool({ name, args }: FunctionCall): Promise<string> {
    return await tracer.startActiveSpan("tool", async (span) => {
      try {
        span.setAttribute("tool.name", name!);
        span.setAttribute("tool.args", JSON.stringify(args));

        const tool = ToolRegistry[name! as keyof typeof ToolRegistry];
        if (!tool) {
          return `Error: tool ${name} not found`;
        }

        this.onEvent({
          type: EventType.ToolCall,
          displayText: `Calling tool: ${name} with args: ${JSON.stringify(args)}`,
        });

        const toolResponse = await tool.function(args!);

        this.onEvent({
          type: EventType.ToolResponse,
          displayText: `Tool response: ${toolResponse.slice(0, 100)}${toolResponse.length > 100 ? "..." : ""}`,
        });

        span.setAttribute("tool.response", toolResponse);
        return toolResponse;
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

  async agentLoop(prompt: string): Promise<string> {
    const span = trace.getActiveSpan();
    let message: PartListUnion = prompt;

    this.onEvent({
      type: EventType.ChatMessage,
      displayText: prompt,
    });

    let turnCount = -1;
    while (true) {
      turnCount++;

      if (turnCount > MaxTurns) {
        message = [message, "This is the last turn. You **must** return a text response now."];
      }

      span!.addEvent("turnStarted", { "event.attributes.turnCount": turnCount });
      const response = await this.sendMessage(message);

      if (response.functionCalls && response.functionCalls.length > 0) {
        const fc = response.functionCalls[0];
        const result = await this.executeTool(fc);
        message = {
          functionResponse: {
            name: fc.name,
            response: { result },
          },
        };
        continue;
      } else if (response.text) {
        this.onEvent({
          type: EventType.ChatResponse,
          displayText: response.text,
        });
        return response.text;
      } else {
        return "Error: failed to get text response.";
      }
    }
  }

  async run(prompt: string): Promise<string> {
    return await tracer.startActiveSpan("run", async (span) => {
      try {
        return await this.agentLoop(prompt);
      } catch (error) {
        span.recordException(error as Error);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: (error as Error).message,
        });
        return "Error: failed to reach the AI agent. Please check your API Key and internet connection.";
      } finally {
        span.end();
      }
    });
  }
}

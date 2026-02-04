import { EventPayload } from "./event.ts";
import { ToolSchema } from "./tool.ts";

export type Sender = "user" | "system";

export type MessageVariant = "text" | "tool";

export interface Message {
  id: number;
  content: string;
  sender: Sender;
  variant?: MessageVariant;
}

export type ChatOptions = {
  maxTurns: number;
  tools?: ToolSchema[];
  onEvent: (event: EventPayload) => void;
};

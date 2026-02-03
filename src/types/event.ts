import z from "zod";

export const EventType = Object.freeze(
  {
    ChatMessage: "chatMessage",
    ChatResponse: "chatResponse",
    ToolCall: "toolCall",
    ToolResponse: "toolResponse",
  } as const,
);
export type EventType = typeof EventType[keyof typeof EventType];

export const eventPayload = z.object({
  type: z.enum([...Object.values(EventType)]),
  displayText: z.string().optional(),
});
export type EventPayload = z.infer<typeof eventPayload>;

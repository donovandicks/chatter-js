export type Sender = "user" | "system";

export interface Message {
  id: number;
  content: string;
  sender: Sender;
}

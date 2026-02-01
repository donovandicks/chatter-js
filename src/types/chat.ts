export type Sender = "user" | "system";

export interface Message {
  id: string;
  content: string;
  sender: Sender;
}

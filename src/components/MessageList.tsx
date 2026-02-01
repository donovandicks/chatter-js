import React from "react";
import { Box, Text } from "ink";
import { Message } from "../types/chat.ts";

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <Box flexDirection="column" flexGrow={1} overflowY="hidden">
      {messages.map((msg) => (
        <Box key={msg.id} paddingLeft={1}>
          <Text color={msg.sender === "user" ? "green" : "blue"}>
            {msg.sender === "user" ? "User: " : "System: "}
          </Text>
          <Text>{msg.content}</Text>
        </Box>
      ))}
    </Box>
  );
};

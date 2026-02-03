import React from "react";
import { Box, Text } from "ink";
import { Message } from "../types/chat.ts";

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = React.memo(({ messages }) => {
  return (
    <Box flexDirection="column" flexGrow={1}>
      {messages.map((msg) => {
        if (msg.variant === "tool") {
          return (
            <Box
              key={msg.id}
              paddingX={1}
              marginBottom={1}
              borderStyle="single"
              borderColor="gray"
              flexDirection="column"
            >
              <Box marginBottom={0}>
                <Text color="gray" bold>Tool Execution</Text>
              </Box>
              <Text color="gray" dimColor italic>
                {msg.content}
              </Text>
            </Box>
          );
        }

        const isUser = msg.sender === "user";
        const color = isUser ? "green" : "blue";
        const title = isUser ? "User" : "System";

        return (
          <Box
            key={msg.id}
            flexDirection="column"
            borderStyle="round"
            borderColor={color}
            marginBottom={1}
            paddingX={1}
          >
            <Box marginBottom={1}>
              <Text color={color} bold underline>
                {title}
              </Text>
            </Box>
            <Box>
              <Text>{msg.content}</Text>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
});

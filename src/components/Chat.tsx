import { useEffect, useMemo, useState } from "react";
import { Box, Text, useStdout } from "ink";
import TextInput from "ink-text-input";
import { Message } from "../types/chat.ts";
import { ChatService } from "../services/chatService.ts";
import { EventType } from "../types/event.ts";
import { MessageList } from "./MessageList.tsx";
import { LoadingIndicator } from "./LoadingIndicator.tsx";
import { ScrollView } from "./ScrollView.tsx";

export const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { stdout } = useStdout();
  const [dimensions, setDimensions] = useState({
    columns: stdout?.columns || 80,
    rows: stdout?.rows || 24,
  });

  const chatService = useMemo(() => {
    return new ChatService({
      onEvent: (event) => {
        if (event.type === EventType.ToolCall || event.type === EventType.ToolResponse) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              content: event.displayText || "",
              sender: "system",
              variant: "tool",
            },
          ]);
        }
      },
    });
  }, []);

  useEffect(() => {
    const onResize = () => {
      setDimensions({
        columns: stdout?.columns || 80,
        rows: stdout?.rows || 24,
      });
    };

    stdout?.on("resize", onResize);
    return () => {
      stdout?.off("resize", onResize);
    };
  }, [stdout]);

  const handleSubmit = async (value: string) => {
    if (!value.trim()) return;

    const userMsg = chatService.createUserMessage(value);
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const systemMsg = await chatService.sendMessage(value);
      setMessages((prev) => [...prev, systemMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate the available height for the scroll view
  // Total rows - (paddingY * 2) - (input area height + margin)
  // Input area height = 1 (content) + 2 (border) = 3
  // Input margin top = 1
  // Root paddingY = 1, so top=1, bottom=1.
  // Total chrome = 1 (top) + 1 (bottom) + 3 (input) + 1 (margin) = 6
  const viewHeight = dimensions.rows - 6;

  return (
    <Box
      flexDirection="column"
      width={dimensions.columns}
      height={dimensions.rows}
      paddingX={1}
      paddingY={1}
    >
      <ScrollView height={viewHeight}>
        <MessageList messages={messages} />
        {isLoading && (
          <Box marginTop={1}>
            <LoadingIndicator />
          </Box>
        )}
      </ScrollView>

      <Box
        borderStyle="single"
        borderColor="gray"
        paddingX={1}
        flexShrink={0}
        marginTop={1}
      >
        <Box marginRight={1}>
          <Text color="green">{">"}</Text>
        </Box>
        <TextInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          placeholder="Type your message..."
        />
      </Box>
    </Box>
  );
};

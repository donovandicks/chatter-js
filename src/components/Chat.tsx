import { useEffect, useState } from "react";
import { Box, Text, useStdout } from "ink";
import TextInput from "ink-text-input";
import { Message } from "../types/chat.ts";
import { chatService } from "../services/chatService.ts";
import { MessageList } from "./MessageList.tsx";

export const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { stdout } = useStdout();
  const [dimensions, setDimensions] = useState({
    columns: stdout?.columns || 80,
    rows: stdout?.rows || 24,
  });

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

    const systemMsg = await chatService.sendMessage(value);
    setMessages((prev) => [...prev, systemMsg]);
  };

  return (
    <Box
      flexDirection="column"
      width={dimensions.columns}
      height={dimensions.rows}
    >
      <MessageList messages={messages} />

      <Box
        borderStyle="single"
        borderColor="gray"
        paddingLeft={1}
        paddingRight={1}
        flexShrink={0}
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

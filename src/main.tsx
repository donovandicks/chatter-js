import "@std/dotenv/load";
import { useEffect, useState } from "react";
import { Box, render, Text, useStdout } from "ink";
import TextInput from "ink-text-input";

type Sender = "user" | "system";

interface Message {
  id: string;
  content: string;
  sender: Sender;
}

const Chat = () => {
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

  const handleSubmit = (value: string) => {
    if (!value.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      content: value,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Mock system response
    setTimeout(() => {
      const systemMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: `You said: "${value}"`,
        sender: "system",
      };
      setMessages((prev) => [...prev, systemMsg]);
    }, 500);
  };

  return (
    <Box
      flexDirection="column"
      width={dimensions.columns}
      height={dimensions.rows}
    >
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

if (import.meta.main) {
  // Clear screen to give a full-screen app feel
  console.clear();
  render(<Chat />);
}

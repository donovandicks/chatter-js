import React, { useEffect, useRef } from "react";
import { Box, useInput } from "ink";
import { ScrollView as ScrollViewImpl } from "ink-scroll-view";

interface ScrollViewProps {
  height: number;
  children: React.ReactNode;
}

export const ScrollView: React.FC<ScrollViewProps> = ({ height, children }) => {
  // deno-lint-ignore no-explicit-any
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new content arrives
    if (scrollRef.current) {
      scrollRef.current.scrollToBottom();
    }
  }, [children]);

  useInput((_input, key) => {
    if (!scrollRef.current) return;

    if (key.upArrow) {
      scrollRef.current.scrollBy(-1);
    }
    if (key.downArrow) {
      scrollRef.current.scrollBy(1);
    }
    if (key.pageUp) {
      scrollRef.current.scrollBy(-height);
    }
    if (key.pageDown) {
      scrollRef.current.scrollBy(height);
    }
  });

  return (
    <Box height={height} flexDirection="column" borderStyle="single" borderColor="gray">
      <ScrollViewImpl ref={scrollRef}>
        {children}
      </ScrollViewImpl>
    </Box>
  );
};

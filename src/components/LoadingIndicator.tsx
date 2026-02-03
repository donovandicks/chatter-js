import { useEffect, useState } from "react";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import { format } from "@std/fmt/duration";
import { SECOND } from "@std/datetime";

export const LoadingIndicator = () => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box paddingLeft={1}>
      <Box marginRight={1}>
        <Text color="blue">System:</Text>
      </Box>
      <Text color="gray">
        <Spinner type="dots" />
      </Text>
      <Box marginLeft={1}>
        <Text color="gray">
          {format(elapsedSeconds * SECOND, { ignoreZero: true })}
        </Text>
      </Box>
    </Box>
  );
};

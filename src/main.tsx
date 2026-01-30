import "@std/dotenv/load"; // Autoload .env files on startup
import { useEffect, useState } from "react";
import { render, Text } from "ink";

const Counter = () => {
  const [counter, setCounter] = useState<number>(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prev) => prev + 1);
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);
  return <Text color="green">{counter} tests passed</Text>;
};

if (import.meta.main) {
  render(<Counter />);
}

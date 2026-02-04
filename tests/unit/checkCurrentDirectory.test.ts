import { checkPathWithinCurrentDir } from "../../src/tools/utils/checkCurrentDirectory.ts";
import { assertEquals } from "@std/assert";

Deno.test({
  name: "checkPathWithinCurrentDir",
  fn: () => {
    const cases = [
      {
        path: ".",
        expected: true,
      },
      {
        path: "./path",
        expected: true,
      },
      {
        path: "/Applications",
        expected: false,
      },
      {
        path: Deno.cwd(),
        expected: true,
      },
      {
        path: `${Deno.cwd()}/path`,
        expected: true,
      },
    ];

    for (const { path, expected } of cases) {
      const actual = checkPathWithinCurrentDir(path);
      assertEquals(actual, expected);
    }
  },
});

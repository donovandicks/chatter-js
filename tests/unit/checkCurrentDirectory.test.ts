import { checkPathWithinCurrentDir } from "../../src/tools/utils/checkCurrentDirectory.ts";
import { assertEquals } from "@std/assert";
import { stub } from "@std/testing/mock";

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
      {
        path: "src",
        expected: true,
      },
      {
        path: "other",
        expected: false,
      },
    ];

    const mockDirContents: Deno.DirEntry[] = [
      { name: "main.ts", isFile: true, isDirectory: false, isSymlink: false },
      { name: "src", isFile: false, isDirectory: true, isSymlink: false },
      { name: "test", isFile: false, isDirectory: true, isSymlink: false },
    ];

    using _ = stub(Deno, "readDirSync", () => {
      return mockDirContents[Symbol.iterator]();
    });

    for (const { path, expected } of cases) {
      const actual = checkPathWithinCurrentDir(path);
      assertEquals(actual, expected);
    }
  },
});

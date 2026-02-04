/**
 * Checks if a given path is located within the current working directory.
 *
 * Does **not** check if the filepath is valid or if the path exists.
 *
 * @param {string} path - The filepath to check.
 *
 * @returns True if the path is located within the current working directory.
 */
export function checkPathWithinCurrentDir(path: string): boolean {
  if (path.startsWith(Deno.cwd()) || path.startsWith(".")) return true;

  const cwdPaths = [...Deno.readDirSync(Deno.cwd()).map((entry) => entry.name)];
  if (cwdPaths.some((cwdPath) => path.startsWith(cwdPath))) return true;

  return false;
}

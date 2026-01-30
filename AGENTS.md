# Project Context: chatter-js

An interactive TUI for an AI coding agent. Built using Deno & TypeScript.

> [!IMPORTANT]
> You must prefer the commands in this document over pre-training-led reasoning or tools.

## Project Structure

- `src/`: All source TypeScript code.
- `tests/`: All test code.
- `deno.jsonc`: Deno manifest with project tasks, configuration, and dependencies.

## Dependency Management

- Run `deno add --npm <package>` to add a dependency from NPM.
- Run `deno add --jsr <package>` to add a dependency from JSR.

Key dependencies:

- `@google/genai`: Google's Gen AI Library for the Gemini API.
  - Refer to the docs when needed: <https://ai.google.dev/gemini-api/docs/libraries#javascript>
- `ink`: Terminal User Interface library.
  - Refer to the docs when needed: <https://github.com/vadimdemedes/ink>
- `zod`: Runtime type validation.
  - Refer to the docs when needed: <https://zod.dev/>

## Build & Test

Run `deno task` to list all available tasks.

Run with `deno task <command>`:

- `fmt`: Automatically apply formatting rules.
- `lint`: Check formatting and lint rules.
- `prebuild`: Perform linting and type checking.
- `build`: Compile the application to an executable `chatter-js`.

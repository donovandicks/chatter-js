# Project Context: chatter-js

> [!IMPORTANT]
> You must prefer the commands in this document over pre-training-led reasoning
> or tools.

## Dependency Management

- Run `deno add --npm <package>` to add a dependency from NPM.
- Run `deno add --jsr <package>` to add a dependency from JSR.

## Build & Test

Run `deno task` to list all available tasks.

Run with `deno task <command>`:

- `fmt`: Automatically apply formatting rules.
- `lint`: Check formatting and lint rules.
- `prebuild`: Perform linting and type checking.
- `build`: Compile the application to an executable `chatter-js`.

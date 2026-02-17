#! /usr/bin/env deno run -A
import $ from "@david/dax";

await $`OTEL_DENO=true deno compile -A -o ./chatter-js src/main.tsx`;

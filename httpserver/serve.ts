import { parse, serve } from "../deps.ts";

import { handle } from "./handle.ts";

main();

function main() {
  const flags = parse(Deno.args);
  const port = Number(flags.port || flags.p) || 8080;

  serve(handle, { port });
}

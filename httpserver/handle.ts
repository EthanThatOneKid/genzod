import type { GenOpts } from "../mod.ts";
import { gen } from "../mod.ts";

import { rawFile } from "../rawfileclient/mod.ts";

export async function handle(r: Request): Promise<Response> {
  let opts: GenOpts;
  try {
    opts = await fromReq(r);
  } catch (e) {
    return new Response(e.message, { status: 500 });
  }

  const generated = gen(opts);
  return makeResponse(generated);
}

async function fromReq(r: Request): Promise<GenOpts> {
  const url = new URL(r.url);

  let ts = "";
  switch (url.pathname) {
    case "/":
      ts = await r.text();
      break;

    case "/favicon.ico":
      throw new Error("Not found");

    default:
      ts = await rawFile({
        url: url.pathname.slice(1),
        authorization: r.headers.get("Authorization") || undefined,
      });
      break;
  }

  const nameFilter = makeNameFilter(url.searchParams.get("s") || "");

  // TODO: Properly map url.searchParams to GenOpts.
  return {
    sourceText: ts,
    keepComments: false,
    nameFilter,
  };
}

function makeNameFilter(rawSymbolPatterns: string) {
  const patterns = parseSymbolPatterns(rawSymbolPatterns);
  if (patterns.length === 0) {
    return undefined;
  }

  console.log({ patterns });

  return (name: string) => patterns.some((p) => p.test(name));
}

function parseSymbolPatterns(rawSymbolPatterns: string): RegExp[] {
  if (!rawSymbolPatterns) {
    return [];
  }

  return rawSymbolPatterns.split(",").map((s) =>
    new RegExp(`^` + s.replace(/\*+/g, ".*") + `$`)
  );
}

function makeResponse(generated: ReturnType<typeof gen>): Response {
  const status = generated.errors.length > 0 ? 500 : 200;

  return new Response(generated.zodSchemasFile, {
    status,
    headers: {
      "Content-Type": "application/typescript; charset=UTF-8",
    },
  });
}

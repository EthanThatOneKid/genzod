export interface RawFileOpts {
  // The URL of the text file to fetch.
  // E.g. GitHub, Pastebin, or any other URL that returns a text file.
  url: string;

  // Incoming authorization header.
  // E.g. "Bearer <token>".
  authorization?: string;
}

export async function rawFile(o: RawFileOpts): Promise<string> {
  const headers = new Headers();
  if (o.authorization) {
    headers.set("Authorization", o.authorization);
  }

  return await (await fetch(o.url, { headers })).text();
}

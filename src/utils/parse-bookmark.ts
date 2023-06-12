import {z} from 'zod';

export type Bookmark = Readonly<z.TypeOf<typeof bookmarkSchema>>;

const bookmarkSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  ctime: z.number().int(),
  mtime: z.number().int().optional(),
  clickCount: z.number().int().optional(),
});

export function parseBookmark(text: string): Bookmark | undefined {
  const searchResults = /^\[(.*)\]\((.*)\) `(.*)`$/.exec(text);
  const title = searchResults?.[1]!.replace(/\\\[/g, `[`).replace(/\\\]/g, `]`).trim();
  const url = searchResults?.[2];
  const code = searchResults?.[3];

  if (!code) {
    return undefined;
  }

  try {
    return bookmarkSchema.parse({...JSON.parse(code), title, url});
  } catch {
    return undefined;
  }
}

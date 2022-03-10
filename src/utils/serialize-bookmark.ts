import type {Bookmark} from './parse-bookmark';

export function serializeBookmark(bookmark: Bookmark): string {
  const {title, url, ...properties} = bookmark;

  const escapedTitle = title
    .replace(/\[/g, `\\[`)
    .replace(/\]/g, `\\]`)
    .replace(/\s+/g, ` `)
    .trim();

  return `[${escapedTitle}](${url.trim()}) \`${JSON.stringify(properties)}\``;
}

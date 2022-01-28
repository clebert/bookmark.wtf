import type {Bookmark} from './parse-bookmark';

export function serializeBookmark(bookmark: Bookmark): string {
  const {title, url, ...properties} = bookmark;
  const escapedTitle = title.replace(/\[/g, `\\[`).replace(/\]/g, `\\]`);

  return `[${escapedTitle}](${url}) \`${JSON.stringify(properties)}\``;
}

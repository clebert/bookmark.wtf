import type {Bookmark} from './parse-bookmark.js';

export function compareClickCount(a: Bookmark, b: Bookmark): number {
  return (a.clickCount ?? 0) - (b.clickCount ?? 0);
}

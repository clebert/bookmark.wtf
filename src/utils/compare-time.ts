import type {Bookmark} from './parse-bookmark';

export function compareTime(a: Bookmark, b: Bookmark): number {
  return (a.mtime ?? a.ctime) - (b.mtime ?? b.ctime);
}

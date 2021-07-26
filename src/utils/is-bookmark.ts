import {isRecord} from './is-record';
import {Bookmark} from './parse-bookmark';

export function isBookmark(value: unknown): value is Bookmark {
  return (
    isRecord(value) &&
    typeof value.title === 'string' &&
    typeof value.url === 'string' &&
    typeof value.ctime === 'number' &&
    (typeof value.mtime === 'number' || value.mtime === undefined) &&
    (typeof value.clickCount === 'number' || value.clickCount === undefined)
  );
}

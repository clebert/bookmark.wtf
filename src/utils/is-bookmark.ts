import {isNumber} from './is-number';
import {isRecord} from './is-record';
import {isString} from './is-string';
import type {Bookmark} from './parse-bookmark';

export function isBookmark(value: unknown): value is Bookmark {
  return (
    isRecord(value) &&
    isString(value.title) &&
    isString(value.url) &&
    isNumber(value.ctime) &&
    (isNumber(value.mtime) || value.mtime === undefined) &&
    (isNumber(value.clickCount) || value.clickCount === undefined)
  );
}

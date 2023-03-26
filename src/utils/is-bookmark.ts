import type {Bookmark} from './parse-bookmark.js';

import {isNumber} from './is-number.js';
import {isRecord} from './is-record.js';
import {isString} from './is-string.js';

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

import {isNumber} from './is-number';
import {isRecord} from './is-record';

export interface Bookmark {
  readonly title: string;
  readonly url: string;
  readonly ctime: number;
  readonly mtime?: number;
  readonly clickCount?: number;
}

export function parseBookmark(text: string): Bookmark | undefined {
  const result = /^\[(.*)\]\((.*)\) `(.*)`$/.exec(text);
  const title = result?.[1]?.replace(/\\\[/g, `[`).replace(/\\\]/g, `]`).trim();
  const url = result?.[2];
  const code = result?.[3];

  if (!title || !url || !code) {
    return undefined;
  }

  try {
    new URL(url);
  } catch {
    return undefined;
  }

  let properties: unknown;

  try {
    properties = code && JSON.parse(code);
  } catch {
    return undefined;
  }

  if (
    !isRecord(properties) ||
    !isNumber(properties.ctime) ||
    (!isNumber(properties.mtime) && properties.mtime !== undefined) ||
    (!isNumber(properties.clickCount) && properties.clickCount !== undefined)
  ) {
    return undefined;
  }

  const {ctime, mtime, clickCount} = properties;

  return {title, url, ctime, mtime, clickCount};
}

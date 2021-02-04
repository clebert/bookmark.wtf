import {lexer} from 'marked';
import {ModelAdapter} from '../hooks/use-gist';
import {isNumber} from '../utils/is-number';
import {isObject} from '../utils/is-object';
import {isString} from '../utils/is-string';

export interface Bookmark {
  readonly title: string;
  readonly url: string;
  readonly properties: BookmarkProperties;
}

export interface BookmarkProperties {
  readonly ctime: number;
  readonly mtime?: number;
  readonly clickCount?: number;
}

export class BookmarkAdapter implements ModelAdapter<Bookmark> {
  parse(data: string): Bookmark | undefined {
    const paragraphToken: unknown = lexer(data)[0];

    if (
      !isObject(paragraphToken) ||
      paragraphToken.type !== 'paragraph' ||
      !Array.isArray(paragraphToken.tokens)
    ) {
      return undefined;
    }

    const linkToken: unknown = paragraphToken.tokens[0];

    if (
      !isObject(linkToken) ||
      linkToken.type !== 'link' ||
      !isString(linkToken.href) ||
      !isString(linkToken.text)
    ) {
      return undefined;
    }

    const codespanToken: unknown = paragraphToken.tokens[2];

    if (
      !isObject(codespanToken) ||
      codespanToken.type !== 'codespan' ||
      !isString(codespanToken.text)
    ) {
      return undefined;
    }

    let properties: unknown;

    try {
      const code = new DOMParser().parseFromString(
        codespanToken.text,
        'text/html'
      ).documentElement.textContent;

      properties = code && JSON.parse(code);
    } catch {
      return undefined;
    }

    if (
      !isObject(properties) ||
      !isNumber(properties.ctime) ||
      (!isNumber(properties.mtime) && properties.mtime !== undefined) ||
      (!isNumber(properties.clickCount) && properties.clickCount !== undefined)
    ) {
      return undefined;
    }

    const {text, href} = linkToken;
    const {ctime, mtime, clickCount} = properties;

    return {title: text, url: href, properties: {ctime, mtime, clickCount}};
  }

  serialize(bookmark: Bookmark): string {
    return `[${bookmark.title.replace(/\[/g, '\\[').replace(/\]/g, '\\]')}](${
      bookmark.url
    }) \`${JSON.stringify(bookmark.properties)}\``;
  }

  compare(bookmarkA: Bookmark, bookmarkB: Bookmark): -1 | 0 | 1 {
    const {
      ctime: ctimeA,
      mtime: timeA = ctimeA,
      clickCount: clickCountA = 0,
    } = bookmarkA.properties;

    const {
      ctime: ctimeB,
      mtime: timeB = ctimeB,
      clickCount: clickCountB = 0,
    } = bookmarkB.properties;

    if (clickCountA !== clickCountB) {
      return clickCountA < clickCountB ? 1 : -1;
    }

    return timeA < timeB ? 1 : timeA > timeB ? -1 : 0;
  }
}

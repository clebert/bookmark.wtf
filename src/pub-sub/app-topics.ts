import type {Bookmark} from '../utils/parse-bookmark.js';

import {BrowserJsonItem} from './browser-json-item.js';
import {BrowserJsonParam} from './browser-json-param.js';
import {BrowserPathname} from './browser-pathname.js';
import {ReactTopic} from './react-topic.js';
import {ensure} from '../utils/ensure.js';
import {isBookmark} from '../utils/is-bookmark.js';
import {isLiteral} from '../utils/is-literal.js';
import {isNonEmptyString} from '../utils/is-non-empty-string.js';
import {isString} from '../utils/is-string.js';

export interface AppTopics {
  readonly bookmark: ReactTopic<Bookmark | undefined>;
  readonly colorScheme: ReactTopic<'auto' | 'light' | 'dark'>;
  readonly gistName: ReactTopic<string>;
  readonly searchTerm: ReactTopic<string>;
  readonly sortOrder: ReactTopic<'clickCount' | 'timeAsc' | 'timeDesc'>;
  readonly token: ReactTopic<string>;
}

export const AppTopics: AppTopics = {
  bookmark: new ReactTopic(
    new BrowserJsonItem({
      key: `bookmark`,
      output: ensure(isBookmark, undefined),
    }),
  ),

  colorScheme: new ReactTopic(
    new BrowserJsonItem({
      key: `colorScheme`,
      output: ensure(isLiteral([`auto`, `light`, `dark`] as const), `auto`),
    }),
  ),

  gistName: new ReactTopic(
    new BrowserPathname({
      input: (gistName) => `/` + gistName,
      output: (pathname) => {
        const segments = pathname.split(`/`);

        return segments.length === 2 ? segments[1]! : ``;
      },
    }),
  ),

  searchTerm: new ReactTopic(
    new BrowserJsonParam({
      key: `search`,
      replace: true,
      input: ensure(isNonEmptyString, undefined),
      output: ensure(isString, ``),
    }),
  ),

  sortOrder: new ReactTopic(
    new BrowserJsonItem({
      key: `sortOrder`,
      output: ensure(
        isLiteral([`clickCount`, `timeAsc`, `timeDesc`] as const),
        `clickCount`,
      ),
    }),
  ),

  token: new ReactTopic(
    new BrowserJsonItem({
      key: `token`,
      input: ensure(isNonEmptyString, undefined),
      output: ensure(isString, ``),
    }),
  ),
};

window.addEventListener(`popstate`, AppTopics.gistName.republish);
window.addEventListener(`popstate`, AppTopics.searchTerm.republish);

import {ensure} from '../utils/ensure';
import {isBookmark} from '../utils/is-bookmark';
import {isLiteral} from '../utils/is-literal';
import {isNonEmptyString} from '../utils/is-non-empty-string';
import {isString} from '../utils/is-string';
import {Bookmark} from '../utils/parse-bookmark';
import {BrowserJsonItem} from './browser-json-item';
import {BrowserJsonParam} from './browser-json-param';
import {BrowserPathname} from './browser-pathname';
import {PreactTopic} from './preact-topic';

export interface AppTopics {
  readonly bookmark: PreactTopic<Bookmark | undefined>;
  readonly colorScheme: PreactTopic<'auto' | 'light' | 'dark'>;
  readonly gistName: PreactTopic<string>;
  readonly searchTerm: PreactTopic<string>;
  readonly sortOrder: PreactTopic<'clickCount' | 'timeAsc' | 'timeDesc'>;
  readonly token: PreactTopic<string>;
}

export const AppTopics: AppTopics = {
  bookmark: new PreactTopic(
    new BrowserJsonItem({
      key: 'bookmark',
      output: ensure(isBookmark, undefined),
    })
  ),

  colorScheme: new PreactTopic(
    new BrowserJsonItem({
      key: 'colorScheme',
      output: ensure(isLiteral(['auto', 'light', 'dark'] as const), 'auto'),
    })
  ),

  gistName: new PreactTopic(
    new BrowserPathname({
      input: (gistName) => '/' + gistName,
      output: (pathname) => {
        const segments = pathname.split('/');

        return segments.length === 2 ? segments[1]! : '';
      },
    })
  ),

  searchTerm: new PreactTopic(
    new BrowserJsonParam({
      key: 'search',
      replace: true,
      input: ensure(isNonEmptyString, undefined),
      output: ensure(isString, ''),
    })
  ),

  sortOrder: new PreactTopic(
    new BrowserJsonItem({
      key: 'sortOrder',
      output: ensure(
        isLiteral(['clickCount', 'timeAsc', 'timeDesc'] as const),
        'clickCount'
      ),
    })
  ),

  token: new PreactTopic(
    new BrowserJsonItem({
      key: 'token',
      input: ensure(isNonEmptyString, undefined),
      output: ensure(isString, ''),
    })
  ),
};

window.addEventListener('popstate', AppTopics.gistName.republish);
window.addEventListener('popstate', AppTopics.searchTerm.republish);

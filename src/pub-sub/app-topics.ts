import {Bookmark} from '../utils/parse-bookmark';
import {BrowserJsonItem} from './browser-json-item';
import {BrowserJsonParam} from './browser-json-param';
import {BrowserPathname} from './browser-pathname';
import {literalType} from './literal-type';
import {PreactTopic} from './preact-topic';

export type ColorScheme = 'auto' | 'light' | 'dark';
export type SortOrder = 'clickCount' | 'timeAsc' | 'timeDesc';

export class AppTopics {
  static readonly bookmark = new PreactTopic(
    new BrowserJsonItem<Bookmark>('bookmark', localStorage),
    (bookmark: Bookmark | undefined) => bookmark,
    (bookmark) => bookmark
  );

  static readonly colorScheme = new PreactTopic(
    new BrowserJsonItem<string>('colorScheme', localStorage),
    (colorScheme: ColorScheme) => colorScheme,
    literalType(['auto', 'light', 'dark'] as const, 'auto')
  );

  static readonly gistName = new PreactTopic(
    new BrowserPathname('pushState'),
    (gistName: string) => '/' + gistName,
    (pathname) => {
      const segments = pathname.split('/');

      return segments.length === 2 ? segments[1]! : '';
    }
  );

  static readonly searchTerm = new PreactTopic(
    new BrowserJsonParam<string>('search', 'replaceState'),
    (searchTerm: string) => searchTerm || undefined,
    (searchTerm) => searchTerm ?? ''
  );

  static readonly sortOrder = new PreactTopic(
    new BrowserJsonItem<string>('sortOrder', localStorage),
    (sortOrder: SortOrder) => sortOrder,
    literalType(['clickCount', 'timeAsc', 'timeDesc'] as const, 'clickCount')
  );

  static readonly token = new PreactTopic(
    new BrowserJsonItem<string>('token', localStorage),
    (token: string) => token || undefined,
    (token) => token ?? ''
  );
}

window.addEventListener('popstate', AppTopics.gistName.republish);
window.addEventListener('popstate', AppTopics.searchTerm.republish);

import {Bookmark} from '../utils/parse-bookmark';
import {BrowserJsonItem} from './browser-json-item';
import {BrowserJsonParam} from './browser-json-param';
import {BrowserPathname} from './browser-pathname';
import {ensureIsLiteralType} from './ensure-is-literal-type';
import {ensureIsNonEmptyString} from './ensure-is-non-empty-string';
import {ensureIsNullableObject} from './ensure-is-nullable-object';
import {ensureIsString} from './ensure-is-string';
import {PreactTopic} from './preact-topic';

export type ColorScheme = 'auto' | 'light' | 'dark';
export type SortOrder = 'clickCount' | 'timeAsc' | 'timeDesc';

export class AppTopics {
  static readonly bookmark = new PreactTopic<Bookmark | undefined>(
    new BrowserJsonItem({
      key: 'bookmark',
      storage: localStorage,
      output: ensureIsNullableObject(),
    })
  );

  static readonly colorScheme = new PreactTopic<ColorScheme>(
    new BrowserJsonItem({
      key: 'colorScheme',
      storage: localStorage,
      output: ensureIsLiteralType(['auto', 'light', 'dark'] as const, 'auto'),
    })
  );

  static readonly gistName = new PreactTopic<string>(
    new BrowserPathname({
      method: 'pushState',
      input: (gistName) => '/' + gistName,
      output: (pathname) => {
        const segments = pathname.split('/');

        return segments.length === 2 ? segments[1]! : '';
      },
    })
  );

  static readonly searchTerm = new PreactTopic<string>(
    new BrowserJsonParam({
      key: 'search',
      method: 'replaceState',
      input: ensureIsNonEmptyString(),
      output: ensureIsString(),
    })
  );

  static readonly sortOrder = new PreactTopic<SortOrder>(
    new BrowserJsonItem({
      key: 'sortOrder',
      storage: localStorage,
      output: ensureIsLiteralType(
        ['clickCount', 'timeAsc', 'timeDesc'] as const,
        'clickCount'
      ),
    })
  );

  static readonly token = new PreactTopic<string>(
    new BrowserJsonItem({
      key: 'token',
      storage: localStorage,
      input: ensureIsNonEmptyString(),
      output: ensureIsString(),
    })
  );
}

window.addEventListener('popstate', AppTopics.gistName.republish);
window.addEventListener('popstate', AppTopics.searchTerm.republish);

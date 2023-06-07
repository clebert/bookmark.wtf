import {BrowserJsonItem} from './browser-json-item.js';
import {BrowserJsonParam} from './browser-json-param.js';
import {BrowserPathname} from './browser-pathname.js';
import {ReactTopic} from './react-topic.js';
import {z} from 'zod';

export interface AppTopics {
  readonly colorScheme: ReactTopic<z.TypeOf<typeof colorSchemeSchema>>;
  readonly gistName: ReactTopic<string>;
  readonly searchTerm: ReactTopic<string>;
  readonly sortOrder: ReactTopic<z.TypeOf<typeof sortOrderSchema>>;
  readonly token: ReactTopic<string>;
}

const colorSchemeSchema = z.union([
  z.literal(`auto`),
  z.literal(`light`),
  z.literal(`dark`),
]);

const sortOrderSchema = z.union([
  z.literal(`clickCount`),
  z.literal(`timeAsc`),
  z.literal(`timeDesc`),
]);

export const AppTopics: AppTopics = {
  colorScheme: new ReactTopic(
    new BrowserJsonItem({
      key: `colorScheme`,
      output: (value) => {
        const result = colorSchemeSchema.safeParse(value);

        return result.success ? result.data : `auto`;
      },
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
      input: (value) => value || undefined,
      output: (value) => {
        const result = z.string().safeParse(value);

        return result.success ? result.data : ``;
      },
    }),
  ),

  sortOrder: new ReactTopic(
    new BrowserJsonItem({
      key: `sortOrder`,
      output: (value) => {
        const result = sortOrderSchema.safeParse(value);

        return result.success ? result.data : `clickCount`;
      },
    }),
  ),

  token: new ReactTopic(
    new BrowserJsonItem({
      key: `token`,
      input: (value) => value || undefined,
      output: (value) => {
        const result = z.string().safeParse(value);

        return result.success ? result.data : ``;
      },
    }),
  ),
};

window.addEventListener(`popstate`, AppTopics.gistName.republish);
window.addEventListener(`popstate`, AppTopics.searchTerm.republish);

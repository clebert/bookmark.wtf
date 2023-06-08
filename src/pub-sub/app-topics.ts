import {BrowserJsonItem} from './browser-json-item.js';
import {BrowserJsonParam} from './browser-json-param.js';
import {ReactTopic} from './react-topic.js';
import {z} from 'zod';

export interface AppTopics {
  readonly searchTerm: ReactTopic<string>;
  readonly sortOrder: ReactTopic<z.TypeOf<typeof sortOrderSchema>>;
  readonly token: ReactTopic<string>;
}

const sortOrderSchema = z.union([
  z.literal(`clickCount`),
  z.literal(`timeAsc`),
  z.literal(`timeDesc`),
]);

export const AppTopics: AppTopics = {
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

window.addEventListener(`popstate`, AppTopics.searchTerm.republish);

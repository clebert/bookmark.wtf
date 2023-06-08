import {createStore} from 'state-guard';
import {z} from 'zod';

const [, initialValue = ``] = location.pathname.split(`/`);

export const gistNameStore = createStore({
  initialState: `current`,
  initialValue,
  valueSchemaMap: {current: z.string()},
  transitionsMap: {current: {set: `current`}},
});

gistNameStore.subscribe(() => {
  const url = new URL(location.href);

  url.pathname = `/${gistNameStore.get().value}`;

  if (url.href !== location.href) {
    history.pushState(undefined, ``, url.href);
  }
});

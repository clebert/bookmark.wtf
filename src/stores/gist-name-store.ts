import {createStateMachine} from 'state-guard';

const [, initialGistName = ``] = location.pathname.split(`/`);

export const gistNameStore = createStateMachine({
  initialState: `current`,
  initialValue: initialGistName,
  transformerMap: {
    current: (gistName: string) => gistName,
  },
  transitionsMap: {current: {set: `current`}},
});

gistNameStore.subscribe(() => {
  const url = new URL(location.href);

  url.pathname = `/${gistNameStore.get().value}`;

  if (url.href !== location.href) {
    history.pushState(undefined, ``, url.href);
  }
});

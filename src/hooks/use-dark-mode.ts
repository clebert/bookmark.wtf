import {useStore} from './use-store.js';
import {colorSchemeStore} from '../stores/color-scheme-store.js';
import * as React from 'react';

const mediaQuery = window.matchMedia(`(prefers-color-scheme: dark)`);

export function useDarkMode(): boolean {
  const colorSchemeSnapshot = useStore(colorSchemeStore);
  const [prefersDark, setPrefersDark] = React.useState(mediaQuery.matches);

  React.useEffect(() => {
    const listener = () => setPrefersDark(mediaQuery.matches);

    mediaQuery.addEventListener(`change`, listener);

    return () => mediaQuery.removeEventListener(`change`, listener);
  }, []);

  return (
    colorSchemeSnapshot.state === `dark` ||
    (colorSchemeSnapshot.state === `auto` && prefersDark)
  );
}

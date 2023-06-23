import {colorSchemeMachine} from '../machines/color-scheme-machine.js';
import * as React from 'react';

const mediaQuery = window.matchMedia(`(prefers-color-scheme: dark)`);

export function useDarkMode(): boolean {
  const colorSchemeSnapshot = React.useSyncExternalStore(colorSchemeMachine.subscribe, () =>
    colorSchemeMachine.get(),
  );

  const [prefersDark, setPrefersDark] = React.useState(mediaQuery.matches);

  React.useEffect(() => {
    const listener = () => setPrefersDark(mediaQuery.matches);

    mediaQuery.addEventListener(`change`, listener);

    return () => {
      mediaQuery.removeEventListener(`change`, listener);
    };
  }, []);

  return (
    colorSchemeSnapshot.state === `isDark` ||
    (colorSchemeSnapshot.state === `isSystem` && prefersDark)
  );
}

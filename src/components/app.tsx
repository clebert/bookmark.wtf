import {ErrorPage} from './error-page.js';
import {HomePage} from './home-page.js';
import {UserPage} from './user-page.js';
import {StylesContext} from '../contexts/styles-context.js';
import {useDarkMode} from '../hooks/use-dark-mode.js';
import {app} from '../state-machines/app.js';
import * as React from 'react';

export function App(): JSX.Element {
  const styles = React.useContext(StylesContext);

  React.useLayoutEffect(() => {
    document.querySelector(`body`)?.classList.add(...styles.background().split(` `));
  }, []);

  const darkMode = useDarkMode();

  React.useLayoutEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add(`dark`);
    } else {
      document.documentElement.classList.remove(`dark`);
    }
  }, [darkMode]);

  const appSnapshot = React.useSyncExternalStore(app.subscribe, () => app.get());

  return appSnapshot.state === `isInitialized` ? (
    <HomePage appSnapshot={appSnapshot} />
  ) : appSnapshot.state === `hasError` ? (
    <ErrorPage appSnapshot={appSnapshot} />
  ) : (
    <UserPage appSnapshot={appSnapshot} />
  );
}

import {ErrorBoundary} from './error-boundary.js';
import {ErrorPage} from './error-page.js';
import {HomePage} from './home-page.js';
import {UserPage} from './user-page.js';
import {StylesContext} from '../contexts/styles-context.js';
import {useAuthStore} from '../hooks/use-auth-store.js';
import {useDarkMode} from '../hooks/use-dark-mode.js';
import * as React from 'react';

export function App(): JSX.Element {
  const styles = React.useContext(StylesContext);

  React.useLayoutEffect(() => {
    document
      .querySelector(`body`)
      ?.classList.add(...styles.background().split(` `));
  }, []);

  const darkMode = useDarkMode();

  React.useLayoutEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add(`dark`);
    } else {
      document.documentElement.classList.remove(`dark`);
    }
  }, [darkMode]);

  const authStore = useAuthStore();

  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      {authStore.state === `authorized` ? (
        <UserPage authStore={authStore} />
      ) : (
        <HomePage authStore={authStore} />
      )}
    </ErrorBoundary>
  );
}

import type {JSX} from 'preact';
import {useLayoutEffect} from 'preact/hooks';
import {useAuthStore} from '../hooks/use-auth-store.js';
import {useDarkMode} from '../hooks/use-dark-mode.js';
import {Colors} from '../utils/colors.js';
import {ErrorBoundary} from './error-boundary.js';
import {ErrorPage} from './error-page.js';
import {HomePage} from './home-page.js';
import {UserPage} from './user-page.js';

export function App(): JSX.Element {
  const authStore = useAuthStore();
  const darkMode = useDarkMode();

  useLayoutEffect(() => {
    document
      .querySelector(`body`)
      ?.classList.add(...Colors.background().split(` `));
  }, []);

  useLayoutEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add(`dark`);
    } else {
      document.documentElement.classList.remove(`dark`);
    }
  }, [darkMode]);

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

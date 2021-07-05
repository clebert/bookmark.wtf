import {JSX} from 'preact';
import {useLayoutEffect} from 'preact/hooks';
import {useAuthStore} from '../hooks/use-auth-store';
import {useDarkMode} from '../hooks/use-dark-mode';
import {Colors} from '../utils/colors';
import {ErrorBoundary} from './error-boundary';
import {ErrorPage} from './error-page';
import {HomePage} from './home-page';
import {UserPage} from './user-page';

export function App(): JSX.Element {
  const authStore = useAuthStore();
  const darkMode = useDarkMode();

  useLayoutEffect(() => {
    document
      .querySelector('body')
      ?.classList.add(...Colors.background().split(' '));
  }, []);

  useLayoutEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      {authStore.state === 'authorized' ? (
        <UserPage authStore={authStore} />
      ) : (
        <HomePage authStore={authStore} />
      )}
    </ErrorBoundary>
  );
}

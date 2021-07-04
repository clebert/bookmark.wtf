import {JSX} from 'preact';
import {useLayoutEffect} from 'preact/hooks';
import {useAuthStore} from '../hooks/use-auth-store';
import {HistoryContext, useHistory} from '../hooks/use-history';
import {useUiMode} from '../hooks/use-ui-mode';
import {Colors} from '../utils/colors';
import {ErrorBoundary} from './error-boundary';
import {ErrorPage} from './error-page';
import {HomePage} from './home-page';
import {UserPage} from './user-page';

export function App(): JSX.Element {
  const authStore = useAuthStore();
  const uiMode = useUiMode();

  useLayoutEffect(() => {
    document
      .querySelector('body')
      ?.classList.add(...Colors.background().split(' '));
  }, []);

  useLayoutEffect(() => {
    if (uiMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [uiMode]);

  return (
    <HistoryContext.Provider value={useHistory()}>
      <ErrorBoundary fallback={<ErrorPage />}>
        {authStore.state === 'authorized' ? (
          <UserPage authStore={authStore} />
        ) : (
          <HomePage authStore={authStore} />
        )}
      </ErrorBoundary>
    </HistoryContext.Provider>
  );
}

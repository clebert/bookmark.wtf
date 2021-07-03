import {JSX} from 'preact';
import {useLayoutEffect} from 'preact/hooks';
import {useAuthStore} from '../hooks/use-auth-store';
import {HistoryContext, useHistory} from '../hooks/use-history';
import {UIModeContext, useUIMode} from '../hooks/use-ui-mode';
import {Colors} from '../utils/colors';
import {ErrorBoundary} from './error-boundary';
import {ErrorPage} from './error-page';
import {HomePage} from './home-page';
import {UserPage} from './user-page';

export function App(): JSX.Element {
  const authStore = useAuthStore();

  useLayoutEffect(() => {
    document
      .querySelector('body')
      ?.classList.add(...Colors.background().split(' '));
  }, []);

  return (
    <HistoryContext.Provider value={useHistory()}>
      <UIModeContext.Provider value={useUIMode()}>
        <ErrorBoundary fallback={<ErrorPage />}>
          {authStore.state === 'authorized' ? (
            <UserPage authStore={authStore} />
          ) : (
            <HomePage authStore={authStore} />
          )}
        </ErrorBoundary>
      </UIModeContext.Provider>
    </HistoryContext.Provider>
  );
}

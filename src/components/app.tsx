import {JSX, h} from 'preact';
import {useAuthStore} from '../hooks/use-auth-store';
import {HistoryContext, useHistory} from '../hooks/use-history';
import {AuthorizedPage} from './authorized-page';
import {ErrorBoundary} from './error-boundary';
import {ErrorPage} from './error-page';
import {UnauthorizedPage} from './unauthorized-page';

export function App(): JSX.Element {
  const authStore = useAuthStore();
  const history = useHistory();

  return (
    <HistoryContext.Provider value={history}>
      <ErrorBoundary fallback={<ErrorPage />}>
        {authStore.state === 'authorized' ? (
          <AuthorizedPage authStore={authStore} />
        ) : (
          <UnauthorizedPage authStore={authStore} />
        )}
      </ErrorBoundary>
    </HistoryContext.Provider>
  );
}

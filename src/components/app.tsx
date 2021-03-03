import {JSX, h} from 'preact';
import {useLayoutEffect} from 'preact/hooks';
import {useAuthStore} from '../hooks/use-auth-store';
import {HistoryContext, useHistory} from '../hooks/use-history';
import {Colors} from '../utils/colors';
import {AuthorizedPage} from './authorized-page';
import {ErrorBoundary} from './error-boundary';
import {ErrorPage} from './error-page';
import {UnauthorizedPage} from './unauthorized-page';

export function App(): JSX.Element {
  const authStore = useAuthStore();
  const history = useHistory();

  useLayoutEffect(() => {
    const colorScheme = localStorage.getItem('colorScheme');

    const {matches: prefersDark} = window.matchMedia(
      '(prefers-color-scheme: dark)'
    );

    if (colorScheme === 'dark' || (!colorScheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    }

    document
      .querySelector('body')
      ?.classList.add(...Colors.background().split(' '));
  }, []);

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

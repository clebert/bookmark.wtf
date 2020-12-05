import {BulmaContainer, BulmaSection} from '@clebert/bulma-preact';
import {JSX, h} from 'preact';
import {useAuth} from '../hooks/use-auth';
import {HistoryContext, useHistory} from '../hooks/use-history';
import {ErrorBoundary} from './error-boundary';
import {AuthorizedScreen} from './screens/authorized-screen';
import {ErrorScreen} from './screens/error-screen';
import {UnauthorizedScreen} from './screens/unauthorized-screen';

export function App(): JSX.Element {
  const history = useHistory();
  const authState = useAuth();

  return (
    <HistoryContext.Provider value={history}>
      <BulmaSection>
        <BulmaContainer isWidescreen>
          <ErrorBoundary fallback={<ErrorScreen />}>
            {authState.status === 'authorized' ? (
              <AuthorizedScreen authState={authState} />
            ) : (
              <UnauthorizedScreen authState={authState} />
            )}
          </ErrorBoundary>
        </BulmaContainer>
      </BulmaSection>
    </HistoryContext.Provider>
  );
}

import {ErrorPage} from './error-page.js';
import {HomePage} from './home-page.js';
import {UserPage} from './user-page.js';
import {appMachine} from '../machines/app-machine.js';
import {beginAuthorization} from '../utils/begin-authorization.js';
import * as React from 'react';
import {
  Button,
  ColorSchemeButton,
  Container,
  Icon,
  Page,
  Styles,
  Topbar,
  WtfHeadline,
} from 'wtfkit';

export function App(): JSX.Element {
  const styles = React.useMemo(() => new Styles(), []);
  const appSnapshot = React.useSyncExternalStore(appMachine.subscribe, () => appMachine.get());

  return (
    <Page styles={styles}>
      <Topbar className="Topbar">
        <Container>
          <WtfHeadline subdomainName="bookmark" />
        </Container>

        <Container grow>
          <ColorSchemeButton className="ColorSchemeButton" />

          {appSnapshot.state === `isInitialized` ? (
            <Button
              className="SignInButton"
              title="Sign in with GitHub"
              onClick={beginAuthorization}
            >
              <Icon type="arrowLeftOnRectangle" />
              Sign in with GitHub
            </Button>
          ) : (
            <Button
              className="SignOutButton"
              title="Sign out"
              onClick={appSnapshot.actions.setInitialized}
            >
              <Icon type="arrowRightOnRectangle" />
              Sign out
            </Button>
          )}
        </Container>
      </Topbar>

      {appSnapshot.state === `isInitialized` ? (
        <HomePage />
      ) : appSnapshot.state === `hasError` ? (
        <ErrorPage />
      ) : (
        <UserPage appSnapshot={appSnapshot} />
      )}
    </Page>
  );
}

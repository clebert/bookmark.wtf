import React from 'react';
import {BulmaLevel} from '../../bulma/bulma-level';
import {AuthorizedAuthState} from '../../hooks/use-auth-state';
import {useGistNameState} from '../../hooks/use-gist-name-state';
import {HistoryContext} from '../../hooks/use-history';
import {UserStateContext, useUserState} from '../../hooks/use-user-state';
import {AppName} from '../app-name';
import {CloseGistButton} from '../buttons/close-gist-button';
import {SignOutButton} from '../buttons/sign-out-button';
import {GistView} from '../views/gist-view';
import {NoGistView} from '../views/no-gist-view';

export interface AuthorizedScreenProps {
  readonly authState: AuthorizedAuthState;
}

export function AuthorizedScreen({
  authState,
}: AuthorizedScreenProps): JSX.Element {
  const history = React.useContext(HistoryContext);
  const gistNameState = useGistNameState(history);
  const userState = useUserState(authState);

  return (
    <UserStateContext.Provider value={userState}>
      <BulmaLevel
        items={[<AppName />, <SignOutButton authState={authState} />]}
        rightItems={
          gistNameState.status === 'set'
            ? [<CloseGistButton gistNameState={gistNameState} />]
            : []
        }
      />

      {gistNameState.status === 'set' ? (
        <GistView authState={authState} gistNameState={gistNameState} />
      ) : (
        <NoGistView authState={authState} gistNameState={gistNameState} />
      )}
    </UserStateContext.Provider>
  );
}

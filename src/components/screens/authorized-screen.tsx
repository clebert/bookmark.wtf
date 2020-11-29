import React from 'react';
import {BulmaLevel} from '../../bulma/bulma-level';
import {useGistName} from '../../hooks/use-gist-name';
import {UserContext, UserDependencies, useUser} from '../../hooks/use-user';
import {AppName} from '../app-name';
import {CloseGistButton} from '../buttons/close-gist-button';
import {SignOutButton} from '../buttons/sign-out-button';
import {GistView} from '../views/gist-view';
import {NoGistView} from '../views/no-gist-view';

export interface AuthorizedScreenProps extends UserDependencies {}

export function AuthorizedScreen({
  authState,
}: AuthorizedScreenProps): JSX.Element {
  const gistNameState = useGistName();
  const userState = useUser({authState});

  return (
    <UserContext.Provider value={userState}>
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
    </UserContext.Provider>
  );
}

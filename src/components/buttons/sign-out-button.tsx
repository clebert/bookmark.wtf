import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import {BulmaButton} from '../../bulma/bulma-button';
import {BulmaField} from '../../bulma/bulma-field';
import {BulmaIcon} from '../../bulma/bulma-icon';
import {BulmaText} from '../../bulma/bulma-text';
import {AuthorizedAuthState} from '../../hooks/use-auth-state';
import {UserStateContext} from '../../hooks/use-user-state';

export interface SignOutButtonProps {
  readonly authState: AuthorizedAuthState;
}

export function SignOutButton({authState}: SignOutButtonProps): JSX.Element {
  const userState = React.useContext(UserStateContext);

  return (
    <BulmaField hasAddons>
      <BulmaButton size="small" isRounded onClick={authState.signOut}>
        <BulmaIcon definition={faSignOutAlt}>Sign out</BulmaIcon>
      </BulmaButton>

      {userState.status === 'failed' ? (
        <BulmaButton size="small" isRounded isStatic>
          <BulmaText color="danger">Oops! Something went wrong.</BulmaText>
        </BulmaButton>
      ) : (
        <BulmaButton
          size="small"
          isLoading={userState.status === 'receiving'}
          isRounded
          isStatic
        >
          Signed in as {userState.value}.
        </BulmaButton>
      )}
    </BulmaField>
  );
}

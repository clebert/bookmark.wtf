import {BulmaButton} from '@clebert/bulma-react/lib/bulma-button';
import {BulmaField} from '@clebert/bulma-react/lib/bulma-field';
import {BulmaIcon} from '@clebert/bulma-react/lib/bulma-icon';
import {BulmaText} from '@clebert/bulma-react/lib/bulma-text';
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import {AuthorizedAuthState} from '../../hooks/use-auth';
import {UserContext} from '../../hooks/use-user';

export interface SignOutButtonProps {
  readonly authState: AuthorizedAuthState;
}

export function SignOutButton({authState}: SignOutButtonProps): JSX.Element {
  const userState = React.useContext(UserContext);

  return (
    <BulmaField hasAddons>
      <BulmaButton size="small" isRounded onClick={authState.signOut}>
        <BulmaIcon definition={faSignOutAlt}>Sign out</BulmaIcon>
      </BulmaButton>

      {userState.status === 'failure' ? (
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

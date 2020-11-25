import {faGithub} from '@fortawesome/free-brands-svg-icons';
import React from 'react';
import {BulmaButton} from '../../bulma/bulma-button';
import {BulmaField} from '../../bulma/bulma-field';
import {BulmaIcon} from '../../bulma/bulma-icon';
import {
  AuthorizingAuthState,
  UnauthorizedAuthState,
} from '../../hooks/use-auth-state';

export interface SignInButtonProps {
  readonly authState: UnauthorizedAuthState | AuthorizingAuthState;
}

export function SignInButton({authState}: SignInButtonProps): JSX.Element {
  return (
    <BulmaField hasAddons>
      <BulmaButton
        size="small"
        isDisabled={authState.status === 'authorizing'}
        isRounded
        onClick={authState.signIn}
      >
        <BulmaIcon definition={faGithub}>Sign in</BulmaIcon>
      </BulmaButton>
    </BulmaField>
  );
}

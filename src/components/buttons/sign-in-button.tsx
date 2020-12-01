import {BulmaButton} from '@clebert/bulma-react/lib/bulma-button';
import {BulmaField} from '@clebert/bulma-react/lib/bulma-field';
import {BulmaIcon} from '@clebert/bulma-react/lib/bulma-icon';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import React from 'react';
import {
  AuthorizingAuthState,
  UnauthorizedAuthState,
} from '../../hooks/use-auth';

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

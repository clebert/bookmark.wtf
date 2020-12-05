import {BulmaButton, BulmaField, BulmaIcon} from '@clebert/bulma-preact';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import {JSX, h} from 'preact';
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

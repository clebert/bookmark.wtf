import {BulmaButton, BulmaField, BulmaIcon} from '@clebert/bulma-preact';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import {JSX, h} from 'preact';
import {AuthorizingAuth, UnauthorizedAuth} from '../../hooks/use-auth';

export interface SignInButtonProps {
  readonly auth: UnauthorizedAuth | AuthorizingAuth;
}

export function SignInButton({auth}: SignInButtonProps): JSX.Element {
  return (
    <BulmaField hasAddons>
      <BulmaButton
        size="small"
        isDisabled={auth.state === 'authorizing'}
        isRounded
        onClick={auth.signIn}
      >
        <BulmaIcon definition={faGithub}>Sign in</BulmaIcon>
      </BulmaButton>
    </BulmaField>
  );
}

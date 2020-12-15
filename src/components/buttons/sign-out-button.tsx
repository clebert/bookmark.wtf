import {
  BulmaButton,
  BulmaField,
  BulmaIcon,
  BulmaText,
} from '@clebert/bulma-preact';
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import {JSX, h} from 'preact';
import {useContext} from 'preact/hooks';
import {AuthorizedAuthState} from '../../hooks/use-auth';
import {UserContext} from '../../hooks/use-user';

export interface SignOutButtonProps {
  readonly authState: AuthorizedAuthState;
}

export function SignOutButton({authState}: SignOutButtonProps): JSX.Element {
  const userState = useContext(UserContext);

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

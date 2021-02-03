import {
  BulmaButton,
  BulmaField,
  BulmaIcon,
  BulmaText,
} from '@clebert/bulma-preact';
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import {JSX, h} from 'preact';
import {useContext} from 'preact/hooks';
import {AuthorizedAuth} from '../../hooks/use-auth';
import {UserReceiverContext} from '../../hooks/use-user-receiver';

export interface SignOutButtonProps {
  readonly auth: AuthorizedAuth;
}

export function SignOutButton({auth}: SignOutButtonProps): JSX.Element {
  const userReceiver = useContext(UserReceiverContext);

  return (
    <BulmaField hasAddons>
      <BulmaButton size="small" isRounded onClick={auth.signOut}>
        <BulmaIcon definition={faSignOutAlt}>Sign out</BulmaIcon>
      </BulmaButton>

      {userReceiver.state === 'failed' ? (
        <BulmaButton size="small" isRounded isStatic>
          <BulmaText color="danger">Please sign in again.</BulmaText>
        </BulmaButton>
      ) : (
        <BulmaButton
          size="small"
          isLoading={userReceiver.state === 'receiving'}
          isRounded
          isStatic
        >
          Signed in as {userReceiver.value}.
        </BulmaButton>
      )}
    </BulmaField>
  );
}

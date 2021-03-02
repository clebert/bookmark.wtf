import {ReceivingReceiver, SuccessfulReceiver} from 'loxia';
import {JSX, h} from 'preact';
import {AuthorizedAuthStore} from '../hooks/use-auth-store';
import {Button} from './button';
import {Icon} from './icon';
import {Text} from './text';
import {Topbar} from './topbar';
import {TopbarItem} from './topbar-item';

export interface AuthorizedTopbarProps {
  readonly authStore: AuthorizedAuthStore;
  readonly userReceiver: SuccessfulReceiver<string> | ReceivingReceiver;
}

export function AuthorizedTopbar({
  authStore,
  userReceiver,
}: AuthorizedTopbarProps): JSX.Element {
  return (
    <Topbar>
      <TopbarItem>
        <Button onClick={authStore.signOut}>
          <Icon type="logout" />
          Sign out
        </Button>

        {userReceiver.state === 'successful' && (
          <Text static>
            Signed in as <Text bold>{userReceiver.value}</Text>
          </Text>
        )}
      </TopbarItem>
    </Topbar>
  );
}

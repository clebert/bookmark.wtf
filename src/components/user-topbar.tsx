import {ReceivingReceiver, SuccessfulReceiver} from 'loxia';
import {JSX, h} from 'preact';
import {AuthorizedAuthStore} from '../hooks/use-auth-store';
import {Button} from './button';
import {Icon} from './icon';
import {Label} from './label';
import {Topbar} from './topbar';
import {TopbarItem} from './topbar-item';

export interface UserTopbarProps {
  readonly authStore: AuthorizedAuthStore;
  readonly userReceiver: SuccessfulReceiver<string> | ReceivingReceiver;
}

export function UserTopbar({
  authStore,
  userReceiver,
}: UserTopbarProps): JSX.Element {
  return (
    <Topbar>
      <TopbarItem>
        <Button onClick={authStore.signOut}>
          <Icon type="logout" />
          Sign out
        </Button>

        {userReceiver.state === 'successful' && (
          <Label static>
            Signed in as <Label bold>{userReceiver.value}</Label>
          </Label>
        )}
      </TopbarItem>
    </Topbar>
  );
}

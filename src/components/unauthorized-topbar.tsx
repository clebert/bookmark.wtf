import {JSX, h} from 'preact';
import {
  AuthorizingAuthStore,
  UnauthorizedAuthStore,
} from '../hooks/use-auth-store';
import {Button} from './button';
import {Icon} from './icon';
import {Topbar} from './topbar';

export interface UnauthorizedTopbarProps {
  readonly authStore: AuthorizingAuthStore | UnauthorizedAuthStore;
}

export function UnauthorizedTopbar({
  authStore,
}: UnauthorizedTopbarProps): JSX.Element {
  return (
    <Topbar>
      <Button disabled={!authStore.signIn} onClick={authStore.signIn}>
        <Icon type="login" />
        Sign in with GitHub
      </Button>
    </Topbar>
  );
}

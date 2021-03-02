import {JSX, h} from 'preact';
import {
  AuthorizingAuthStore,
  UnauthorizedAuthStore,
} from '../hooks/use-auth-store';
import {Page} from './page';
import {UnauthorizedTopbar} from './unauthorized-topbar';

export interface UnauthorizedPageProps {
  readonly authStore: AuthorizingAuthStore | UnauthorizedAuthStore;
}

export function UnauthorizedPage({
  authStore,
}: UnauthorizedPageProps): JSX.Element {
  return (
    <Page>
      <UnauthorizedTopbar authStore={authStore} />
    </Page>
  );
}

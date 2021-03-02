import {JSX, h} from 'preact';
import {
  AuthorizingAuthStore,
  UnauthorizedAuthStore,
} from '../hooks/use-auth-store';
import {Button} from './button';
import {Icon} from './icon';
import {Link} from './link';
import {Page} from './page';
import {Text} from './text';
import {Topbar} from './topbar';
import {TopbarItem} from './topbar-item';

export interface UnauthorizedPageProps {
  readonly authStore: AuthorizingAuthStore | UnauthorizedAuthStore;
}

export function UnauthorizedPage({
  authStore,
}: UnauthorizedPageProps): JSX.Element {
  return (
    <Page>
      <Topbar>
        <TopbarItem>
          <Button disabled={!authStore.signIn} onClick={authStore.signIn}>
            <Icon type="login" />
            Sign in with GitHub
          </Button>

          <Link url="https://github.com/clebert/bookmark.wtf" static>
            <Icon type="externalLink" />
            Open source
          </Link>
        </TopbarItem>
      </Topbar>

      <div class="px-2">
        <Text static>
          A bookmark manager that uses GitHub Gist as data back end.
        </Text>
      </div>
    </Page>
  );
}

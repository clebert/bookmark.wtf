import {JSX, h} from 'preact';
import {
  AuthorizingAuthStore,
  UnauthorizedAuthStore,
} from '../hooks/use-auth-store';
import {Button} from './button';
import {Icon} from './icon';
import {Link} from './link';
import {Page} from './page';
import {Paragraph} from './paragraph';
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
        </TopbarItem>

        <TopbarItem>
          <Link url="https://github.com/clebert/bookmark.wtf" static>
            <Icon type="externalLink" />
            Open source
          </Link>
        </TopbarItem>
      </Topbar>

      <Paragraph>
        A bookmark manager that uses GitHub Gist as data back end.
      </Paragraph>
    </Page>
  );
}

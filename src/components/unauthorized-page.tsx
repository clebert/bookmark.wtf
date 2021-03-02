import {JSX, h} from 'preact';
import {
  AuthorizingAuthStore,
  UnauthorizedAuthStore,
} from '../hooks/use-auth-store';
import {join} from '../utils/join';
import {Theme} from '../utils/theme';
import {Button} from './button';
import {Icon} from './icon';
import {Link} from './link';
import {Page} from './page';
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

      <span
        class={join([
          Theme.default().textColor,
          Theme.normalFont,
          'border',
          'border-transparent',
          'cursor-default',
          'select-none',
          'px-2',
        ])}
      >
        A bookmark manager that uses GitHub Gist as data back end.
      </span>
    </Page>
  );
}

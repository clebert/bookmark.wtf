import {JSX, h} from 'preact';
import {useContext} from 'preact/hooks';
import {
  AuthorizingAuthStore,
  UnauthorizedAuthStore,
} from '../hooks/use-auth-store';
import {UIModeContext} from '../hooks/use-ui-mode';
import {Colors} from '../utils/colors';
import {join} from '../utils/join';
import {Button} from './button';
import {Icon} from './icon';
import {Link} from './link';
import {Page} from './page';
import {Paragraph} from './paragraph';
import {Topbar} from './topbar';
import {TopbarItem} from './topbar-item';

export interface HomePageProps {
  readonly authStore: AuthorizingAuthStore | UnauthorizedAuthStore;
}

export function HomePage({authStore}: HomePageProps): JSX.Element {
  const {colorScheme} = useContext(UIModeContext);

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
        A free and open-source bookmark manager that uses GitHub Gist as
        database.
      </Paragraph>

      <div class={join(['max-w-5xl p-1 shadow', Colors.highlightRing()])}>
        <img
          src={`https://raw.githubusercontent.com/clebert/bookmark.wtf/main/screenshot-${
            colorScheme === 'dark' ? 'light' : 'dark'
          }-mode.png`}
        ></img>
      </div>
    </Page>
  );
}

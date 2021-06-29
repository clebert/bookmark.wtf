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
import {ColorSchemeButton} from './color-scheme-button';
import {Headline} from './headline';
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
      <Topbar class="Topbar">
        <TopbarItem>
          <Headline />
        </TopbarItem>

        <TopbarItem>
          <ColorSchemeButton />

          <Button
            class="SignInButton"
            title="Sign in with GitHub"
            onClick={'signIn' in authStore ? authStore.signIn : undefined}
          >
            <Icon type="login" />
            Sign in with GitHub
          </Button>
        </TopbarItem>
      </Topbar>

      <Paragraph>
        A free and open-source bookmark manager that uses GitHub Gist as
        database.{' '}
        <Link
          url="https://github.com/clebert/bookmark.wtf/blob/main/README.md"
          static
        >
          <Icon type="externalLink" />
          README
        </Link>
      </Paragraph>

      <div class={join(['max-w-5xl p-1 shadow', Colors.highlightRing()])}>
        <img
          class="select-none"
          src={`https://raw.githubusercontent.com/clebert/bookmark.wtf/main/screenshot-${colorScheme}-mode.png`}
        ></img>
      </div>
    </Page>
  );
}

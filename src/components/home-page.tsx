import type {JSX} from 'preact';
import type {
  AuthorizingAuthStore,
  UnauthorizedAuthStore,
} from '../hooks/use-auth-store.js';
import {useDarkMode} from '../hooks/use-dark-mode.js';
import {Colors} from '../utils/colors.js';
import {join} from '../utils/join.js';
import {Button} from './button.js';
import {ColorSchemeButton} from './color-scheme-button.js';
import {Headline} from './headline.js';
import {Icon} from './icon.js';
import {Link} from './link.js';
import {Page} from './page.js';
import {Paragraph} from './paragraph.js';
import {TopbarItem} from './topbar-item.js';
import {Topbar} from './topbar.js';

export interface HomePageProps {
  readonly authStore: AuthorizingAuthStore | UnauthorizedAuthStore;
}

export function HomePage({authStore}: HomePageProps): JSX.Element {
  const darkMode = useDarkMode();

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
            onClick={`signIn` in authStore ? authStore.signIn : undefined}
          >
            <Icon type="login" />
            Sign in with GitHub
          </Button>
        </TopbarItem>
      </Topbar>

      <Paragraph>
        A free and open-source bookmark manager that uses GitHub Gist as
        database.{` `}
        <Link
          url="https://github.com/clebert/bookmark.wtf/blob/main/README.md"
          static
        >
          <Icon type="externalLink" />
          README
        </Link>
      </Paragraph>

      <div class={join([`max-w-5xl p-1 shadow`, Colors.highlightRing()])}>
        <img
          class="select-none"
          src={`https://raw.githubusercontent.com/clebert/bookmark.wtf/main/screenshot-${
            darkMode ? `dark` : `light`
          }-mode.png`}
        ></img>
      </div>
    </Page>
  );
}

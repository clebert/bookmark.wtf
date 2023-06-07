import type {
  AuthorizingAuthStore,
  UnauthorizedAuthStore,
} from '../hooks/use-auth-store.js';

import {Button} from './button.js';
import {ColorSchemeButton} from './color-scheme-button.js';
import {Headline} from './headline.js';
import {Icon} from './icon.js';
import {Link} from './link.js';
import {Page} from './page.js';
import {TopbarItem} from './topbar-item.js';
import {Topbar} from './topbar.js';
import {StylesContext} from '../contexts/styles-context.js';
import {useDarkMode} from '../hooks/use-dark-mode.js';
import {joinClassNames} from '../utils/join-class-names.js';
import * as React from 'react';

export interface HomePageProps {
  authStore: AuthorizingAuthStore | UnauthorizedAuthStore;
}

export function HomePage({authStore}: HomePageProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  const darkMode = useDarkMode();

  return (
    <Page>
      <Topbar className="Topbar">
        <TopbarItem>
          <Headline />
        </TopbarItem>

        <TopbarItem>
          <ColorSchemeButton />

          <Button
            className="SignInButton"
            title="Sign in with GitHub"
            onClick={`signIn` in authStore ? authStore.signIn : undefined}
          >
            <Icon type="login" />
            Sign in with GitHub
          </Button>
        </TopbarItem>
      </Topbar>

      <div
        className={joinClassNames(
          styles.border({transparent: true}),
          styles.text(),
        )}
      >
        A free and open-source bookmark manager that uses GitHub Gist as
        database.{` `}
        <Link
          url="https://github.com/clebert/bookmark.wtf/blob/main/README.md"
          static
        >
          <Icon type="externalLink" />
          README
        </Link>
      </div>

      <div className="max-w-5xl p-1 shadow-xl">
        <img
          className="select-none"
          src={`https://raw.githubusercontent.com/clebert/bookmark.wtf/main/screenshot-${
            darkMode ? `dark` : `light`
          }-mode.png`}
        ></img>
      </div>
    </Page>
  );
}

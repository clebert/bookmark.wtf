import type {app} from '../state-machines/app.js';
import type {InferSnapshot} from 'state-guard';

import {Icon} from './icon.js';
import {Link} from './link.js';
import {Page} from './page.js';
import {Topbar} from './topbar.js';
import {StylesContext} from '../contexts/styles-context.js';
import {useDarkMode} from '../hooks/use-dark-mode.js';
import {joinClassNames} from '../utils/join-class-names.js';
import * as React from 'react';

export interface HomePageProps {
  appSnapshot: InferSnapshot<typeof app, 'isInitialized'>;
}

export function HomePage({appSnapshot}: HomePageProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  const darkMode = useDarkMode();

  return (
    <Page>
      <Topbar appSnapshot={appSnapshot} />

      <div className={joinClassNames(styles.border({transparent: true}), styles.text())}>
        A free and open-source bookmark manager that uses GitHub Gist as database.{` `}
        <Link url="https://github.com/clebert/bookmark.wtf/blob/main/README.md" static>
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

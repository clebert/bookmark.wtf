import {Button} from './button.js';
import {ColorSchemeButton} from './color-scheme-button.js';
import {Headline} from './headline.js';
import {Icon} from './icon.js';
import {Page} from './page.js';
import {TopbarItem} from './topbar-item.js';
import {Topbar} from './topbar.js';
import {StylesContext} from '../contexts/styles-context.js';
import {joinClassNames} from '../utils/join-class-names.js';
import * as React from 'react';

export function ErrorPage(): JSX.Element {
  const reload = React.useCallback(
    () => (window.location.href = new URL(window.location.href).origin),
    [],
  );

  const styles = React.useContext(StylesContext);

  return (
    <Page>
      <Topbar>
        <TopbarItem>
          <Headline />
        </TopbarItem>

        <TopbarItem>
          <ColorSchemeButton />

          <Button title="Reload page" onClick={reload}>
            <Icon type="refresh" />
            Reload
          </Button>
        </TopbarItem>
      </Topbar>

      <div
        className={joinClassNames(
          styles.border({transparent: true}),
          styles.text(),
        )}
      >
        Oops, an error occurred!
      </div>
    </Page>
  );
}

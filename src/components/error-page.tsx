import type {JSX} from 'preact';
import {useCallback} from 'preact/hooks';
import {Button} from './button.js';
import {ColorSchemeButton} from './color-scheme-button.js';
import {Headline} from './headline.js';
import {Icon} from './icon.js';
import {Page} from './page.js';
import {Paragraph} from './paragraph.js';
import {TopbarItem} from './topbar-item.js';
import {Topbar} from './topbar.js';

export function ErrorPage(): JSX.Element {
  const reload = useCallback(
    () => (window.location.href = new URL(window.location.href).origin),
    [],
  );

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

      <Paragraph theme="danger">Oops, an error occurred!</Paragraph>
    </Page>
  );
}

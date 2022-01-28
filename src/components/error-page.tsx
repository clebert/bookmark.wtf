import type {JSX} from 'preact';
import {useCallback} from 'preact/hooks';
import {Button} from './button';
import {ColorSchemeButton} from './color-scheme-button';
import {Headline} from './headline';
import {Icon} from './icon';
import {Page} from './page';
import {Paragraph} from './paragraph';
import {Topbar} from './topbar';
import {TopbarItem} from './topbar-item';

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

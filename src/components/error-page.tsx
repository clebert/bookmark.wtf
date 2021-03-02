import {JSX, h} from 'preact';
import {useCallback} from 'preact/hooks';
import {Theme} from '../utils/theme';
import {Button} from './button';
import {Icon} from './icon';
import {Page} from './page';
import {Paragraph} from './paragraph';
import {Topbar} from './topbar';
import {TopbarItem} from './topbar-item';

export function ErrorPage(): JSX.Element {
  const reload = useCallback(
    () => (window.location.href = new URL(window.location.href).origin),
    []
  );

  return (
    <Page>
      <Topbar>
        <TopbarItem>
          <Button onClick={reload}>
            <Icon type="refresh" />
            Reload
          </Button>
        </TopbarItem>
      </Topbar>

      <Paragraph theme={Theme.danger()}>Oops, an error occurred!</Paragraph>
    </Page>
  );
}

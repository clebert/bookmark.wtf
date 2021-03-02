import {JSX, h} from 'preact';
import {useCallback} from 'preact/hooks';
import {join} from '../utils/join';
import {Theme} from '../utils/theme';
import {Button} from './button';
import {Icon} from './icon';
import {Page} from './page';
import {Topbar} from './topbar';
import {TopbarItem} from './topbar-item';

export function ErrorPage(): JSX.Element {
  const reload = useCallback(() => window.location.reload(), []);

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

      <span
        class={join([
          Theme.danger().textColor,
          Theme.normalFont,
          'border',
          'border-transparent',
          'cursor-default',
          'select-none',
          'px-2',
        ])}
      >
        Oops, an error occurred!
      </span>
    </Page>
  );
}

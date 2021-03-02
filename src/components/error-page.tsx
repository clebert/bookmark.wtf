import {JSX, h} from 'preact';
import {join} from '../utils/join';
import {Page} from './page';
import {Topbar} from './topbar';

export function ErrorPage(): JSX.Element {
  return (
    <Page>
      <Topbar>
        <h2
          class={join([
            'text-red-600',
            'text-2xl',
            'font-light',
            'whitespace-nowrap',
            'cursor-default',
            'select-none',
          ])}
        >
          Oops, an error occurred!
        </h2>
      </Topbar>
    </Page>
  );
}

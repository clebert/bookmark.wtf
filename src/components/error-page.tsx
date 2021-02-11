import {JSX, h} from 'preact';
import {Page} from './page';
import {Topbar} from './topbar';

export function ErrorPage(): JSX.Element {
  return (
    <Page>
      <Topbar />
    </Page>
  );
}

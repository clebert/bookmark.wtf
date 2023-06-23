import type {appMachine} from '../machines/app-machine.js';
import type {InferSnapshot} from 'state-guard';

import {Page} from './page.js';
import {Topbar} from './topbar.js';
import {StylesContext} from '../contexts/styles-context.js';
import {joinClassNames} from '../utils/join-class-names.js';
import * as React from 'react';

export interface ErrorPageProps {
  appSnapshot: InferSnapshot<typeof appMachine, 'hasError'>;
}

export function ErrorPage({appSnapshot}: ErrorPageProps): JSX.Element {
  const styles = React.useContext(StylesContext);

  return (
    <Page>
      <Topbar appSnapshot={appSnapshot} />

      <div className={joinClassNames(styles.border({transparent: true}), styles.text())}>
        Oops, an error occurred!
      </div>
    </Page>
  );
}

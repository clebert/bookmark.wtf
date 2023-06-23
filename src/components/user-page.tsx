import type {appMachine} from '../machines/app-machine.js';
import type {InferSnapshot, InferStateUnion} from 'state-guard';

import {BookmarkList} from './bookmark-list.js';
import {CollectionList} from './collection-list.js';
import {Page} from './page.js';
import {Topbar} from './topbar.js';
import * as React from 'react';

export interface UserPageProps {
  appSnapshot: InferSnapshot<
    typeof appMachine,
    Exclude<InferStateUnion<typeof appMachine>, 'isInitialized' | 'hasError'>
  >;
}

export function UserPage({appSnapshot}: UserPageProps): JSX.Element {
  const {state} = appSnapshot;

  const isReading =
    state === `isReadingUser` || state === `isReadingGists` || state === `isReadingGist`;

  return (
    <Page>
      <Topbar appSnapshot={appSnapshot} />

      {!isReading &&
        (state === `hasGists` || state === `isUpdatingGists` ? (
          <CollectionList appSnapshot={appSnapshot} />
        ) : (
          <BookmarkList appSnapshot={appSnapshot} />
        ))}
    </Page>
  );
}

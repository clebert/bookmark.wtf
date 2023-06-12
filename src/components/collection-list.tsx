import type {app} from '../state-machines/app.js';
import type {InferSnapshot} from 'state-guard';

import {CollectionControl} from './collection-control.js';
import {CollectionItem} from './collection-item.js';
import {Grid} from './grid.js';
import * as React from 'react';

export interface CollectionListProps {
  appSnapshot: InferSnapshot<typeof app, 'hasGists' | 'isUpdatingGists'>;
}

export function CollectionList({appSnapshot}: CollectionListProps): JSX.Element | null {
  return (
    <Grid>
      <CollectionControl appSnapshot={appSnapshot} />

      {appSnapshot.value.gists.map(({gistName}, gistIndex) => (
        <CollectionItem key={gistName} appSnapshot={appSnapshot} gistIndex={gistIndex} />
      ))}
    </Grid>
  );
}

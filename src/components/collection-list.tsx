import {JSX, h} from 'preact';
import {AuthorizedAuthStore} from '../hooks/use-auth-store';
import {useGistsStore} from '../hooks/use-gists-store';
import {CollectionControl} from './collection-control';
import {CollectionItem} from './collection-item';
import {Grid} from './grid';
import {GridItem} from './grid-item';
import {Label} from './label';

export interface CollectionListProps {
  readonly authStore: AuthorizedAuthStore;
}

export function CollectionList({authStore}: CollectionListProps): JSX.Element {
  const gistsStore = useGistsStore(authStore, 'https://bookmark.wtf');

  if (gistsStore.state === 'failed') {
    throw gistsStore.reason;
  }

  return gistsStore.state === 'loading' ? (
    <Grid>
      <GridItem row1={<Label static>Loading collections...</Label>} />
    </Grid>
  ) : (
    <Grid>
      <CollectionControl gistsStore={gistsStore} />

      {gistsStore.gists?.map((gist) => (
        <CollectionItem
          key={gist.gistName}
          gistsStore={gistsStore}
          gist={gist}
        />
      ))}
    </Grid>
  );
}

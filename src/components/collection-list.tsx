import {JSX, h} from 'preact';
import {AuthorizedAuthStore} from '../hooks/use-auth-store';
import {useGistsStore} from '../hooks/use-gists-store';
import {CollectionControl} from './collection-control';
import {CollectionItem} from './collection-item';
import {Grid} from './grid';

export interface CollectionListProps {
  readonly authStore: AuthorizedAuthStore;
}

export function CollectionList({authStore}: CollectionListProps): JSX.Element {
  const gistsStore = useGistsStore(authStore, 'https://bookmark.wtf');

  if (gistsStore.state === 'failed') {
    throw gistsStore.reason;
  }

  return (
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

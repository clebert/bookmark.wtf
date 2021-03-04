import {JSX, h} from 'preact';
import {AuthorizedAuthStore} from '../hooks/use-auth-store';
import {useGistsStore} from '../hooks/use-gists-store';
import {useToggle} from '../hooks/use-toggle';
import {CollectionControl} from './collection-control';
import {CollectionItem} from './collection-item';
import {Grid} from './grid';

export interface CollectionListProps {
  readonly authStore: AuthorizedAuthStore;
}

export function CollectionList({
  authStore,
}: CollectionListProps): JSX.Element | null {
  const gistsStore = useGistsStore(authStore, 'https://bookmark.wtf');

  if (gistsStore.state === 'failed') {
    throw gistsStore.reason;
  }

  const [zenMode, toggleZenMode] = useToggle(true);

  return gistsStore.state !== 'loading' ? (
    <Grid>
      <CollectionControl
        gistsStore={gistsStore}
        zenMode={gistsStore.gists.length > 0 ? zenMode : false}
        onToggleZenMode={toggleZenMode}
      />

      {gistsStore.gists.map((gist) => (
        <CollectionItem
          key={gist.gistName}
          gistsStore={gistsStore}
          gist={gist}
          zenMode={zenMode}
        />
      ))}
    </Grid>
  ) : null;
}

import {JSX} from 'preact';
import {useCallback} from 'preact/hooks';
import {ReadyGistsStore, UpdatingGistsStore} from '../hooks/use-gists-store';
import {useToggle} from '../hooks/use-toggle';
import {Button} from './button';
import {GridItem} from './grid-item';
import {Icon} from './icon';
import {Label} from './label';
import {NewCollectionForm} from './new-collection-form';

export interface CollectionControlProps {
  readonly gistsStore: ReadyGistsStore | UpdatingGistsStore;
}

export function CollectionControl({
  gistsStore,
}: CollectionControlProps): JSX.Element {
  const [newMode, toggleNewMode] = useToggle(false);

  const createCollection = useCallback(
    (description: string) => {
      if ('createGist' in gistsStore) {
        gistsStore.createGist(description);
        toggleNewMode();
      }
    },
    [gistsStore]
  );

  const gistCount = gistsStore.gists?.length ?? 0;

  return newMode ? (
    <NewCollectionForm onCancel={toggleNewMode} onCreate={createCollection} />
  ) : (
    <GridItem
      class="CollectionControl"
      row1={
        <Label static>
          <Icon type="viewGrid" />
          {gistCount} collection{gistCount === 1 ? '' : 's'} found
        </Label>
      }
      row2={
        <Button
          class="NewButton"
          title="New collection"
          onClick={toggleNewMode}
        >
          <Icon type="viewGridAdd" />
          New
        </Button>
      }
    />
  );
}

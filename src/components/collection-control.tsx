import {JSX, h} from 'preact';
import {useMemo} from 'preact/hooks';
import {ReadyGistsStore, UpdatingGistsStore} from '../hooks/use-gists-store';
import {useToggle} from '../hooks/use-toggle';
import {Button} from './button';
import {GridItem} from './grid-item';
import {Icon} from './icon';
import {NewCollectionForm} from './new-collection-form';
import {Text} from './text';

export interface CollectionControlProps {
  readonly gistsStore: ReadyGistsStore | UpdatingGistsStore;
}

export function CollectionControl({
  gistsStore,
}: CollectionControlProps): JSX.Element {
  const [creationMode, toggleCreationMode] = useToggle(false);

  const createCollection = useMemo(
    () =>
      gistsStore.createGist
        ? (description: string) => {
            gistsStore.createGist(description);
            toggleCreationMode();
          }
        : undefined,
    [gistsStore]
  );

  const gistCount = gistsStore.gists?.length ?? 0;

  return creationMode ? (
    <NewCollectionForm
      onCancel={toggleCreationMode}
      onCreate={createCollection}
    />
  ) : (
    <GridItem
      row1={
        <Text static>
          {gistCount} collection{gistCount === 1 ? '' : 's'} found
        </Text>
      }
      row2={
        <Button onClick={toggleCreationMode}>
          <Icon type="gridAdd" />
          New collection
        </Button>
      }
    />
  );
}

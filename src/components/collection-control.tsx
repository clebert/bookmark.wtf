import {Fragment, JSX, h} from 'preact';
import {useMemo} from 'preact/hooks';
import {ReadyGistsStore, UpdatingGistsStore} from '../hooks/use-gists-store';
import {useToggle} from '../hooks/use-toggle';
import {Button} from './button';
import {GridItem} from './grid-item';
import {Icon} from './icon';
import {Label} from './label';
import {NewCollectionForm} from './new-collection-form';

export interface CollectionControlProps {
  readonly gistsStore: ReadyGistsStore | UpdatingGistsStore;
  readonly zenMode: boolean;

  onToggleZenMode?(): void;
}

export function CollectionControl({
  gistsStore,
  zenMode,
  onToggleZenMode,
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
        <Label static>
          <Icon type="viewGrid" />
          {gistCount} collection{gistCount === 1 ? '' : 's'} found
        </Label>
      }
      row2={
        <>
          <Button onClick={toggleCreationMode}>
            <Icon type="viewGridAdd" />
            New
          </Button>

          {onToggleZenMode && (
            <Button onClick={onToggleZenMode}>
              <Icon type={zenMode ? 'eye' : 'eyeOff'} />
              Zen
            </Button>
          )}
        </>
      }
    />
  );
}

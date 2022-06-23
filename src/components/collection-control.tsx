import type {JSX} from 'preact';
import {useMemo} from 'preact/hooks';
import type {
  ReadyGistsStore,
  UpdatingGistsStore,
} from '../hooks/use-gists-store.js';
import {useToggle} from '../hooks/use-toggle.js';
import {Button} from './button.js';
import {GridItem} from './grid-item.js';
import {Icon} from './icon.js';
import {Label} from './label.js';
import {NewCollectionForm} from './new-collection-form.js';

export interface CollectionControlProps {
  readonly gistsStore: ReadyGistsStore | UpdatingGistsStore;
}

export function CollectionControl({
  gistsStore,
}: CollectionControlProps): JSX.Element {
  const [newMode, toggleNewMode] = useToggle(false);

  const createCollection = useMemo(
    () =>
      `createGist` in gistsStore
        ? (description: string) => {
            gistsStore.createGist(description);
            toggleNewMode();
          }
        : undefined,
    [gistsStore],
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
          {gistCount} collection{gistCount === 1 ? `` : `s`} found
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

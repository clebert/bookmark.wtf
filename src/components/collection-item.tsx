import type {ShallowGist} from '../apis/gists-api.js';
import type {
  ReadyGistsStore,
  UpdatingGistsStore,
} from '../hooks/use-gists-store.js';

import {DeleteButton} from './delete-button.js';
import {EditButton} from './edit-button.js';
import {EditCollectionForm} from './edit-collection-form.js';
import {GridItem} from './grid-item.js';
import {Icon} from './icon.js';
import {Link} from './link.js';
import {useStore} from '../hooks/use-store.js';
import {useToggle} from '../hooks/use-toggle.js';
import {gistNameStore} from '../stores/gist-name-store.js';
import {uiModeStore} from '../stores/ui-mode-store.js';
import * as React from 'react';

export interface CollectionItemProps {
  gistsStore: ReadyGistsStore | UpdatingGistsStore;
  gist: ShallowGist;
}

export function CollectionItem({
  gistsStore,
  gist: {gistName, description},
}: CollectionItemProps): JSX.Element {
  const openCollection = React.useCallback(
    () => gistNameStore.get().actions.set(gistName),
    [gistName],
  );

  const [editing, toggleEditing] = useToggle(false);

  const updateCollection = React.useMemo(
    () =>
      `updateGist` in gistsStore
        ? (newDescription: string) => {
            gistsStore.updateGist(gistName, newDescription);
            toggleEditing();
          }
        : undefined,
    [gistsStore, gistName],
  );

  const [deleting, toggleDeleting] = useToggle(false, 3000);

  const deleteCollection = React.useCallback(() => {
    if (`deleteGist` in gistsStore) {
      gistsStore.deleteGist(gistName);
    }
  }, [gistsStore, gistName]);

  const showControlsSnapshot = useStore(uiModeStore, `showControls`);

  return editing ? (
    <EditCollectionForm
      initialDescription={description ?? ``}
      onCancel={toggleEditing}
      onUpdate={updateCollection}
    />
  ) : (
    <GridItem
      className="CollectionItem"
      row1={
        <Link url={`/` + gistName} onClick={openCollection}>
          <Icon type="link" />
          {description ?? gistName}
        </Link>
      }
      row2={
        showControlsSnapshot &&
        (deleting ? (
          <>
            <EditButton targetName="collection" />

            <DeleteButton
              targetName="collection"
              verbose
              action={
                gistsStore.state === `ready` ? deleteCollection : undefined
              }
            />
          </>
        ) : (
          <>
            <EditButton
              targetName="collection"
              action={gistsStore.state === `ready` ? toggleEditing : undefined}
            />

            <DeleteButton
              targetName="collection"
              action={gistsStore.state === `ready` ? toggleDeleting : undefined}
            />
          </>
        ))
      }
    />
  );
}

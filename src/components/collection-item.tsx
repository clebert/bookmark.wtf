import type {appMachine} from '../machines/app-machine.js';
import type {InferSnapshot} from 'state-guard';

import {DeleteButton} from './delete-button.js';
import {EditButton} from './edit-button.js';
import {EditCollectionForm} from './edit-collection-form.js';
import {GridItem} from './grid-item.js';
import {Link} from './link.js';
import {uiModeMachine} from '../machines/ui-mode-machine.js';
import * as React from 'react';
import {Icon, useToggle} from 'wtfkit';

export interface CollectionItemProps {
  appSnapshot: InferSnapshot<typeof appMachine, 'hasGists' | 'isUpdatingGists'>;
  gistIndex: number;
}

export function CollectionItem({appSnapshot, gistIndex}: CollectionItemProps): JSX.Element {
  const {token, user, gists} = appSnapshot.value;
  const {gistName, description} = gists[gistIndex]!;

  const openCollection = React.useCallback(() => {
    appSnapshot.actions.readGist({token, user, gistName});
  }, [appSnapshot]);

  const [editing, toggleEditing] = useToggle(false);

  const updateCollection = React.useMemo(
    () =>
      appSnapshot.state === `hasGists`
        ? (newDescription: string) => {
            const operation = {type: `updateGist`, gistName, description: newDescription} as const;

            appSnapshot.actions.updateGists({token, user, gists, operation});
            toggleEditing();
          }
        : undefined,
    [appSnapshot],
  );

  const [deleting, toggleDeleting] = useToggle(false, 3000);

  const deleteCollection = React.useMemo(
    () =>
      appSnapshot.state === `hasGists`
        ? () => {
            const operation = {type: `deleteGist`, gistName} as const;

            appSnapshot.actions.updateGists({token, user, gists, operation});
            toggleDeleting();
          }
        : undefined,
    [appSnapshot],
  );

  const isShowingControls = React.useSyncExternalStore(uiModeMachine.subscribe, () =>
    uiModeMachine.get(`isShowingControls`),
  );

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
        isShowingControls &&
        (deleting ? (
          <>
            <EditButton targetName="collection" />
            <DeleteButton targetName="collection" verbose action={deleteCollection} />
          </>
        ) : (
          <>
            <EditButton
              targetName="collection"
              action={updateCollection ? toggleEditing : undefined}
            />

            <DeleteButton
              targetName="collection"
              action={deleteCollection ? toggleDeleting : undefined}
            />
          </>
        ))
      }
    />
  );
}

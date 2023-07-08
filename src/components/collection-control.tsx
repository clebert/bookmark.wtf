import type {appMachine} from '../machines/app-machine.js';
import type {InferSnapshot} from 'state-guard';

import {GridItem} from './grid-item.js';
import {Label} from './label.js';
import {NewCollectionForm} from './new-collection-form.js';
import {UiModeButton} from './ui-mode-button.js';
import * as React from 'react';
import {Button, Icon, useToggle} from 'wtfkit';

export interface CollectionControlProps {
  appSnapshot: InferSnapshot<typeof appMachine, 'hasGists' | 'isUpdatingGists'>;
}

export function CollectionControl({appSnapshot}: CollectionControlProps): JSX.Element {
  const {token, user, gists} = appSnapshot.value;
  const [newMode, toggleNewMode] = useToggle(false);

  const createCollection = React.useMemo(
    () =>
      appSnapshot.state === `hasGists`
        ? (description: string) => {
            const operation = {type: `createGist`, description} as const;

            appSnapshot.actions.updateGists({token, user, gists, operation});
            toggleNewMode();
          }
        : undefined,
    [appSnapshot],
  );

  return newMode ? (
    <NewCollectionForm onCancel={toggleNewMode} onCreate={createCollection} />
  ) : (
    <GridItem
      className="CollectionControl"
      row1={
        <Label static>
          <Icon type="squares2X2" />
          {gists.length} collection{gists.length === 1 ? `` : `s`} found
        </Label>
      }
      row2={
        <>
          <Button
            className="NewButton"
            title="New collection"
            onClick={createCollection ? toggleNewMode : undefined}
          >
            <Icon type="squaresPlus" />
            New
          </Button>

          <UiModeButton />
        </>
      }
    />
  );
}

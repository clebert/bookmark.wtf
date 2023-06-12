import type {app} from '../state-machines/app.js';
import type {InferSnapshot} from 'state-guard';

import {Button} from './button.js';
import {GridItem} from './grid-item.js';
import {Icon} from './icon.js';
import {Label} from './label.js';
import {NewCollectionForm} from './new-collection-form.js';
import {UiModeButton} from './ui-mode-button.js';
import {useToggle} from '../hooks/use-toggle.js';
import * as React from 'react';

export interface CollectionControlProps {
  appSnapshot: InferSnapshot<typeof app, 'hasGists' | 'isUpdatingGists'>;
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
          <Icon type="viewGrid" />
          {gists.length} collection{gists.length === 1 ? `` : `s`} found
        </Label>
      }
      row2={
        <>
          <Button className="NewButton" title="New collection" onClick={toggleNewMode}>
            <Icon type="viewGridAdd" />
            New
          </Button>

          <UiModeButton />
        </>
      }
    />
  );
}

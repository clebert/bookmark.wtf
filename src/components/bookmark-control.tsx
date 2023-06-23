import type {appMachine} from '../machines/app-machine.js';
import type {Bookmark} from '../utils/parse-bookmark.js';
import type {InferSnapshot} from 'state-guard';

import {Button} from './button.js';
import {GridItem} from './grid-item.js';
import {Icon} from './icon.js';
import {Label} from './label.js';
import {NewBookmarkForm} from './new-bookmark-form.js';
import {SortOrderButton} from './sort-order-button.js';
import {UiModeButton} from './ui-mode-button.js';
import {useToggle} from '../hooks/use-toggle.js';
import {createRandomValue} from '../utils/create-random-value.js';
import {serializeBookmark} from '../utils/serialize-bookmark.js';
import * as React from 'react';

export interface BookmarkControlProps {
  appSnapshot: InferSnapshot<
    typeof appMachine,
    'hasGist' | 'isUpdatingGist' | 'hasForeignGist' | 'isForkingGist'
  >;
}

export function BookmarkControl({appSnapshot}: BookmarkControlProps): JSX.Element {
  const {token, user, gistName, gist} = appSnapshot.value;

  const closeCollection = React.useMemo(
    () =>
      appSnapshot.state !== `isForkingGist`
        ? () => {
            appSnapshot.actions.readGists({token, user});
          }
        : undefined,
    [appSnapshot],
  );

  const [newMode, toggleNewMode] = useToggle(false);

  const createBookmark = React.useMemo(
    () =>
      appSnapshot.state === `hasGist`
        ? (bookmark: Bookmark) => {
            const operation = {
              type: `createFile`,
              filename: createRandomValue() + `.md`,
              content: serializeBookmark(bookmark),
            } as const;

            appSnapshot.actions.updateGist({token, user, gistName, gist, operation});
            toggleNewMode();
          }
        : undefined,
    [appSnapshot],
  );

  const forkCollection = React.useMemo(
    () =>
      appSnapshot.state === `hasForeignGist`
        ? () => {
            appSnapshot.actions.forkGist({token, user, gistName, gist});
          }
        : undefined,
    [appSnapshot],
  );

  const isLocked = appSnapshot.state === `hasForeignGist` || appSnapshot.state === `isForkingGist`;

  return newMode ? (
    <NewBookmarkForm onCancel={toggleNewMode} onCreate={createBookmark} />
  ) : (
    <GridItem
      className="BookmarkControl"
      row1={
        <Label>
          <Icon type={isLocked ? `lockClosed` : `viewGrid`} />
          {gist.description || gistName}
        </Label>
      }
      row2={
        <>
          {forkCollection ? (
            <Button title="Fork collection" onClick={forkCollection}>
              <Icon type="duplicate" />
              Fork
            </Button>
          ) : (
            <Button title="New bookmark" onClick={createBookmark ? toggleNewMode : undefined}>
              <Icon type="viewGridAdd" />
              New
            </Button>
          )}

          <Button title="Close collection" onClick={closeCollection}>
            <Icon type="x" />
            Close
          </Button>

          <SortOrderButton />
          <UiModeButton />
        </>
      }
    />
  );
}

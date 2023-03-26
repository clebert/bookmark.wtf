import type {
  ForkingGistStore,
  LockedGistStore,
  ReadyGistStore,
  UpdatingGistStore,
} from '../hooks/use-gist-store.js';
import type {Bookmark} from '../utils/parse-bookmark.js';
import type {JSX} from 'preact';

import {Button} from './button.js';
import {GridItem} from './grid-item.js';
import {Icon} from './icon.js';
import {Label} from './label.js';
import {NewBookmarkForm} from './new-bookmark-form.js';
import {PasteBookmarkButton} from './paste-bookmark-button.js';
import {SortOrderButton} from './sort-order-button.js';
import {useToggle} from '../hooks/use-toggle.js';
import {AppTopics} from '../pub-sub/app-topics.js';
import {createRandomValue} from '../utils/create-random-value.js';
import {serializeBookmark} from '../utils/serialize-bookmark.js';
import {useCallback, useMemo} from 'preact/hooks';

export interface BookmarkControlProps {
  readonly gistName: string;

  readonly gistStore:
    | ReadyGistStore
    | UpdatingGistStore
    | LockedGistStore
    | ForkingGistStore;
}

export function BookmarkControl({
  gistName,
  gistStore,
}: BookmarkControlProps): JSX.Element {
  const closeCollection = useCallback(() => AppTopics.gistName.publish(``), []);
  const [newMode, toggleNewMode] = useToggle(false);

  const createBookmark = useMemo(
    () =>
      `createFile` in gistStore
        ? (bookmark: Bookmark) => {
            gistStore.createFile(
              createRandomValue() + `.md`,
              serializeBookmark(bookmark),
            );

            toggleNewMode();
          }
        : undefined,
    [gistStore],
  );

  return newMode ? (
    <NewBookmarkForm onCancel={toggleNewMode} onCreate={createBookmark} />
  ) : (
    <GridItem
      class="BookmarkControl"
      row1={
        <Label>
          <Icon
            type={
              gistStore.state !== `locked` && gistStore.state !== `forking`
                ? `viewGrid`
                : `lockClosed`
            }
          />
          {gistStore.gist.description ?? gistName}
        </Label>
      }
      row2={
        <>
          {gistStore.state === `locked` || gistStore.state === `forking` ? (
            <Button
              title="Fork collection"
              onClick={`forkGist` in gistStore ? gistStore.forkGist : undefined}
            >
              <Icon type="duplicate" />
              Fork
            </Button>
          ) : (
            <Button title="New bookmark" onClick={toggleNewMode}>
              <Icon type="viewGridAdd" />
              New
            </Button>
          )}

          <Button title="Close collection" onClick={closeCollection}>
            <Icon type="x" />
            Close
          </Button>

          <SortOrderButton />
          <PasteBookmarkButton gistStore={gistStore} />
        </>
      }
    />
  );
}

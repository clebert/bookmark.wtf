import {Fragment, JSX, h} from 'preact';
import {useCallback, useContext, useMemo} from 'preact/hooks';
import {BookmarkSortOrder} from '../hooks/use-bookmark-sort';
import {
  ForkingGistStore,
  LockedGistStore,
  ReadyGistStore,
  UpdatingGistStore,
} from '../hooks/use-gist-store';
import {HistoryContext} from '../hooks/use-history';
import {useToggle} from '../hooks/use-toggle';
import {changeGistName} from '../utils/change-gist-name';
import {createRandomValue} from '../utils/create-random-value';
import {serializeBookmark} from '../utils/serialize-bookmark';
import {Button} from './button';
import {GridItem} from './grid-item';
import {Icon} from './icon';
import {Label} from './label';
import {NewBookmarkForm} from './new-bookmark-form';
import {SortOrderButton} from './sort-order-button';

export interface BookmarkControlProps {
  readonly gistName: string;

  readonly gistStore:
    | ReadyGistStore
    | UpdatingGistStore
    | LockedGistStore
    | ForkingGistStore;

  readonly sortOrder: BookmarkSortOrder;

  onChangeSortOrder?(): void;
}

export function BookmarkControl({
  gistName,
  gistStore,
  sortOrder,
  onChangeSortOrder,
}: BookmarkControlProps): JSX.Element {
  const history = useContext(HistoryContext);

  const closeCollection = useCallback(
    () => history.push(changeGistName(undefined)),
    []
  );

  const [creationMode, toggleCreationMode] = useToggle(false);

  const createBookmark = useMemo(
    () =>
      'createFile' in gistStore
        ? (title: string, url: string) => {
            gistStore.createFile(
              createRandomValue() + '.md',
              serializeBookmark({title, url, ctime: Date.now()})
            );

            toggleCreationMode();
          }
        : undefined,
    [gistStore]
  );

  return creationMode ? (
    <NewBookmarkForm onCancel={toggleCreationMode} onCreate={createBookmark} />
  ) : (
    <GridItem
      class="BookmarkControl"
      row1={
        gistStore.state !== 'locked' && gistStore.state !== 'forking' ? (
          <Label static>
            <Icon type="viewGrid" />
            {gistStore.gist.description ?? gistName}
          </Label>
        ) : (
          <Label>
            <Icon type="lockClosed" />
            {gistStore.gist.description ?? gistName}
          </Label>
        )
      }
      row2={
        gistStore.state !== 'locked' && gistStore.state !== 'forking' ? (
          <>
            <Button onClick={toggleCreationMode}>
              <Icon type="viewGridAdd" />
              New
            </Button>

            <Button onClick={closeCollection}>
              <Icon type="x" />
              Close
            </Button>

            {onChangeSortOrder && (
              <SortOrderButton
                sortOrder={sortOrder}
                onChangeSortOrder={onChangeSortOrder}
              />
            )}
          </>
        ) : (
          <>
            <Button
              onClick={'forkGist' in gistStore ? gistStore.forkGist : undefined}
            >
              <Icon type="duplicate" />
              Fork
            </Button>

            <Button onClick={closeCollection}>
              <Icon type="x" />
              Close
            </Button>

            {onChangeSortOrder && (
              <SortOrderButton
                sortOrder={sortOrder}
                onChangeSortOrder={onChangeSortOrder}
              />
            )}
          </>
        )
      }
    />
  );
}

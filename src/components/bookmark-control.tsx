import {JSX} from 'preact';
import {useCallback, useContext} from 'preact/hooks';
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

  const [newMode, toggleNewMode] = useToggle(false);

  const createBookmark = useCallback(
    (title: string, url: string) => {
      if ('createFile' in gistStore) {
        gistStore.createFile(
          createRandomValue() + '.md',
          serializeBookmark({title, url, ctime: Date.now()})
        );

        toggleNewMode();
      }
    },
    [gistStore]
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
              gistStore.state !== 'locked' && gistStore.state !== 'forking'
                ? 'viewGrid'
                : 'lockClosed'
            }
          />
          {gistStore.gist.description ?? gistName}
        </Label>
      }
      row2={
        gistStore.state !== 'locked' && gistStore.state !== 'forking' ? (
          <>
            <Button title="New bookmark" onClick={toggleNewMode}>
              <Icon type="viewGridAdd" />
              New
            </Button>

            <Button title="Close collection" onClick={closeCollection}>
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
              title="Fork collection"
              onClick={'forkGist' in gistStore ? gistStore.forkGist : undefined}
            >
              <Icon type="duplicate" />
              Fork
            </Button>

            <Button title="Close collection" onClick={closeCollection}>
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

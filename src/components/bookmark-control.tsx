import {JSX} from 'preact';
import {useCallback, useMemo} from 'preact/hooks';
import {
  ForkingGistStore,
  LockedGistStore,
  ReadyGistStore,
  UpdatingGistStore,
} from '../hooks/use-gist-store';
import {useToggle} from '../hooks/use-toggle';
import {AppHistory} from '../singletons/app-history';
import {createRandomValue} from '../utils/create-random-value';
import {Bookmark} from '../utils/parse-bookmark';
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
}

export function BookmarkControl({
  gistName,
  gistStore,
}: BookmarkControlProps): JSX.Element {
  const closeCollection = useCallback(
    () => AppHistory.singleton.pushGistName(undefined),
    []
  );

  const [newMode, toggleNewMode] = useToggle(false);

  const createBookmark = useMemo(
    () =>
      'createFile' in gistStore
        ? (bookmark: Bookmark) => {
            gistStore.createFile(
              createRandomValue() + '.md',
              serializeBookmark(bookmark)
            );

            toggleNewMode();
          }
        : undefined,
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
        <>
          {gistStore.state === 'locked' || gistStore.state === 'forking' ? (
            <Button
              title="Fork collection"
              onClick={'forkGist' in gistStore ? gistStore.forkGist : undefined}
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
        </>
      }
    />
  );
}

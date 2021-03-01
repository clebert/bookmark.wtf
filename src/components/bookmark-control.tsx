import {Fragment, JSX, h} from 'preact';
import {useCallback, useContext, useMemo} from 'preact/hooks';
import {FailedGistStore, GistStore} from '../hooks/use-gist-store';
import {HistoryContext} from '../hooks/use-history';
import {useToggle} from '../hooks/use-toggle';
import {serializeBookmark} from '../models/serialize-bookmark';
import {createRandomValue} from '../utils/create-random-value';
import {Button} from './button';
import {GridItem} from './grid-item';
import {Icon} from './icon';
import {NewBookmarkForm} from './new-bookmark-form';
import {Text} from './text';

export interface BookmarkControlProps {
  readonly gistName: string;
  readonly gistStore: Exclude<GistStore, FailedGistStore>;
}

export function BookmarkControl({
  gistName,
  gistStore,
}: BookmarkControlProps): JSX.Element {
  const history = useContext(HistoryContext);

  const closeCollection = useCallback(
    () => history.push({type: 'pathname', pathname: '/'}),
    []
  );

  const [creationMode, toggleCreationMode] = useToggle();

  const createBookmark = useMemo(
    () =>
      gistStore.createFile
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
      row1={
        gistStore.state === 'loading' ? (
          <Text static>Loading bookmarks</Text>
        ) : (
          <Text>{gistStore.gist.description ?? gistName}</Text>
        )
      }
      row2={
        gistStore.state !== 'loading' && (
          <>
            <Button onClick={closeCollection}>
              <Icon type="x" />
              Close
            </Button>

            {gistStore.state !== 'locked' ? (
              <Button onClick={toggleCreationMode}>
                <Icon type="gridAdd" />
                New bookmark
              </Button>
            ) : (
              <Text static>
                <Icon type="lockClosed" />
                Owned by <Text bold>{gistStore.gist.owner}</Text>
              </Text>
            )}
          </>
        )
      }
    />
  );
}

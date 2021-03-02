import {Fragment, JSX, h} from 'preact';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'preact/hooks';
import {
  LockedGistStore,
  ReadyGistStore,
  UpdatingGistStore,
} from '../hooks/use-gist-store';
import {HistoryContext} from '../hooks/use-history';
import {useToggle} from '../hooks/use-toggle';
import {serializeBookmark} from '../models/serialize-bookmark';
import {createBookmarklet} from '../utils/create-bookmarklet';
import {createRandomValue} from '../utils/create-random-value';
import {Button} from './button';
import {GridItem} from './grid-item';
import {Icon} from './icon';
import {Link} from './link';
import {NewBookmarkForm} from './new-bookmark-form';
import {Text} from './text';

export interface BookmarkControlProps {
  readonly gistName: string;
  readonly gistStore: ReadyGistStore | UpdatingGistStore | LockedGistStore;
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

  const [initialTitle, setInitialTitle] = useState(
    () => new URL(history.url).searchParams.get('title') ?? ''
  );

  const [initialUrl, setInitialUrl] = useState(
    () => new URL(history.url).searchParams.get('url') ?? ''
  );

  const [creationMode, toggleCreationMode] = useToggle(
    gistStore.state !== 'locked' && Boolean(initialTitle || initialUrl)
  );

  useEffect(() => {
    if (!creationMode) {
      setInitialTitle('');
      setInitialUrl('');
    }
  }, [creationMode]);

  const bookmarklet = useMemo(() => createBookmarklet(gistName), [gistName]);

  useEffect(() => {
    history.replace(
      {type: 'param', key: 'title'},
      {type: 'param', key: 'url'},
      {type: 'param', key: 'version'}
    );

    if (gistStore.state === 'locked') {
      return;
    }

    const version = new URL(history.url).searchParams.get('version');

    if (version && version !== bookmarklet.version) {
      alert(
        'Your bookmarklet is out of date. ' +
          'Please replace it with the latest version.'
      );
    }
  }, []);

  const showBookmarkletHelp = useCallback(
    () =>
      alert(
        'You can save the bookmarklet in the Favorites bar of your browser. ' +
          'This allows you to add new bookmarks without having to enter the title and URL yourself.'
      ),
    []
  );

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
    <NewBookmarkForm
      initialTitle={initialTitle}
      initialUrl={initialUrl}
      onCancel={toggleCreationMode}
      onCreate={createBookmark}
    />
  ) : (
    <GridItem
      row1={
        gistStore.state !== 'locked' ? (
          <Link url={bookmarklet.url} onClick={showBookmarkletHelp}>
            <Icon type="bookmark" />
            {gistStore.gist.description ?? gistName}
          </Link>
        ) : (
          <Text>{gistStore.gist.description ?? gistName}</Text>
        )
      }
      row2={
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
      }
    />
  );
}

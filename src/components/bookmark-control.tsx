import {Fragment, JSX, h} from 'preact';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'preact/hooks';
import {
  ForkingGistStore,
  LockedGistStore,
  ReadyGistStore,
  UpdatingGistStore,
} from '../hooks/use-gist-store';
import {HistoryContext} from '../hooks/use-history';
import {useToggle} from '../hooks/use-toggle';
import {serializeBookmark} from '../models/serialize-bookmark';
import {changeGistName} from '../utils/change-gist-name';
import {createBookmarklet} from '../utils/create-bookmarklet';
import {createRandomValue} from '../utils/create-random-value';
import {Button} from './button';
import {GridItem} from './grid-item';
import {Icon} from './icon';
import {Label} from './label';
import {Link} from './link';
import {NewBookmarkForm} from './new-bookmark-form';

export interface BookmarkControlProps {
  readonly gistName: string;

  readonly gistStore:
    | ReadyGistStore
    | UpdatingGistStore
    | LockedGistStore
    | ForkingGistStore;

  onToggleZenMode?(): void;
}

export function BookmarkControl({
  gistName,
  gistStore,
  onToggleZenMode,
}: BookmarkControlProps): JSX.Element {
  const history = useContext(HistoryContext);

  const closeCollection = useCallback(
    () => history.push(changeGistName(undefined)),
    []
  );

  const [initialTitle, setInitialTitle] = useState(
    () => new URL(history.url).searchParams.get('title') ?? ''
  );

  const [initialUrl, setInitialUrl] = useState(
    () => new URL(history.url).searchParams.get('url') ?? ''
  );

  const [creationMode, toggleCreationMode] = useToggle(
    gistStore.state !== 'locked' &&
      gistStore.state !== 'forking' &&
      Boolean(initialTitle || initialUrl)
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

    if (gistStore.state === 'locked' || gistStore.state === 'forking') {
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
        gistStore.state !== 'locked' && gistStore.state !== 'forking' ? (
          <Link url={bookmarklet.url} onClick={showBookmarkletHelp}>
            <Icon type="bookmark" />
            {gistStore.gist.description ?? gistName}
          </Link>
        ) : (
          <Label>
            <Icon type="lockClosed" />
            {gistStore.gist.description ?? gistName}
          </Label>
        )
      }
      row2={
        <>
          <Button onClick={closeCollection}>
            <Icon type="x" />
            Close
          </Button>

          {gistStore.state !== 'locked' && gistStore.state !== 'forking' ? (
            <>
              <Button onClick={toggleCreationMode}>
                <Icon type="gridAdd" />
                New
              </Button>

              {onToggleZenMode && (
                <Button onClick={onToggleZenMode}>
                  <Icon type="pencil" />
                  Edit
                </Button>
              )}
            </>
          ) : (
            <Button disabled={!gistStore.forkGist} onClick={gistStore.forkGist}>
              <Icon type="duplicate" />
              Fork
            </Button>
          )}
        </>
      }
    />
  );
}

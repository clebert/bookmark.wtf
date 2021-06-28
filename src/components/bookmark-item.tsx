import {Fragment, JSX, h} from 'preact';
import {useCallback} from 'preact/hooks';
import {
  ForkingGistStore,
  LockedGistStore,
  ReadyGistStore,
  UpdatingGistStore,
} from '../hooks/use-gist-store';
import {useTimer} from '../hooks/use-timer';
import {useToggle} from '../hooks/use-toggle';
import {Bookmark} from '../utils/parse-bookmark';
import {serializeBookmark} from '../utils/serialize-bookmark';
import {BookmarkIcon} from './bookmark-icon';
import {Button} from './button';
import {EditBookmarkForm} from './edit-bookmark-form';
import {GridItem} from './grid-item';
import {Icon} from './icon';
import {Link} from './link';

export interface BookmarkItemProps {
  readonly gistStore:
    | ReadyGistStore
    | UpdatingGistStore
    | LockedGistStore
    | ForkingGistStore;

  readonly bookmarkFile: BookmarkFile;
}

export interface BookmarkFile {
  readonly filename: string;
  readonly bookmark: Bookmark;
}

export function BookmarkItem({
  gistStore,
  bookmarkFile,
}: BookmarkItemProps): JSX.Element {
  const {filename, bookmark} = bookmarkFile;

  const openBookmark = useCallback(() => {
    if (
      !window.navigator.userAgent.includes('Firefox') &&
      'updateFile' in gistStore
    ) {
      gistStore.updateFile(
        filename,
        serializeBookmark({
          ...bookmark,
          clickCount: (bookmark.clickCount ?? 0) + 1,
        }),
        true
      );
    }

    window.location.href = bookmark.url;
  }, [filename, bookmark]);

  const [editing, toggleEditing] = useToggle(false);

  const updateBookmark = useCallback(
    (title: string, url: string) => {
      if ('updateFile' in gistStore) {
        gistStore.updateFile(
          filename,
          serializeBookmark({...bookmark, title, url, mtime: Date.now()})
        );

        toggleEditing();
      }
    },
    [gistStore, filename, bookmark]
  );

  const [deleting, toggleDeleting] = useToggle(false, 3000);

  const deleteBookmark = useCallback(() => {
    if ('deleteFile' in gistStore) {
      gistStore.deleteFile(filename);
    }
  }, [gistStore, filename]);

  return editing ? (
    <EditBookmarkForm
      initialTitle={bookmark.title}
      initialUrl={bookmark.url}
      onCancel={toggleEditing}
      onUpdate={updateBookmark}
    />
  ) : (
    <GridItem
      leftCol={
        <BookmarkIcon
          key={bookmark.url}
          initialLinkUrl={bookmark.url}
          onClick={openBookmark}
        />
      }
      row1={
        <Link url={bookmark.url} onClick={openBookmark}>
          <Icon type="externalLink" />
          {bookmark.title}
        </Link>
      }
      row2={
        deleting ? (
          <>
            <Button class="EditButton">
              <Icon type="pencil" standalone />
            </Button>

            <Button
              class="DeleteButton"
              theme="danger"
              onClick={deleteBookmark}
            >
              <Icon type="trash" />
              Delete
            </Button>
          </>
        ) : (
          <>
            <Button
              class="EditButton"
              onClick={gistStore.state === 'ready' ? toggleEditing : undefined}
            >
              <Icon type="pencil" standalone />
            </Button>

            <Button
              class="DeleteButton"
              onClick={gistStore.state === 'ready' ? toggleDeleting : undefined}
            >
              <Icon type="trash" standalone />
            </Button>
          </>
        )
      }
      highlight={useTimer(1500, bookmark.mtime ?? bookmark.ctime)}
    />
  );
}

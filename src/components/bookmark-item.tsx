import {Fragment, JSX, h} from 'preact';
import {useCallback, useMemo} from 'preact/hooks';
import {
  LockedGistStore,
  ReadyGistStore,
  UpdatingGistStore,
} from '../hooks/use-gist-store';
import {useTimer} from '../hooks/use-timer';
import {useToggle} from '../hooks/use-toggle';
import {Bookmark} from '../models/parse-bookmark';
import {serializeBookmark} from '../models/serialize-bookmark';
import {Theme} from '../utils/theme';
import {BookmarkIcon} from './bookmark-icon';
import {Button} from './button';
import {EditBookmarkForm} from './edit-bookmark-form';
import {GridItem} from './grid-item';
import {Icon} from './icon';
import {Link} from './link';

export interface BookmarkItemProps {
  readonly gistStore: ReadyGistStore | UpdatingGistStore | LockedGistStore;
  readonly bookmarkFile: BookmarkFile;
  readonly zenMode: boolean;
}

export interface BookmarkFile {
  readonly filename: string;
  readonly bookmark: Bookmark;
}

export function BookmarkItem({
  gistStore,
  bookmarkFile,
  zenMode,
}: BookmarkItemProps): JSX.Element {
  const {filename, bookmark} = bookmarkFile;
  const [editMode, toggleEditMode] = useToggle(false);

  const updateBookmark = useMemo(
    () =>
      gistStore.updateFile
        ? (title: string, url: string) => {
            gistStore.updateFile(
              filename,
              serializeBookmark({...bookmark, title, url, mtime: Date.now()})
            );
            toggleEditMode();
          }
        : undefined,
    [gistStore, filename, bookmark]
  );

  const [deletable, toggleDeletable] = useToggle(false, 3000);

  const deleteBookmark = useMemo(
    () =>
      !deletable
        ? toggleDeletable
        : gistStore.deleteFile
        ? () => gistStore.deleteFile(filename)
        : undefined,
    [gistStore, filename, deletable]
  );

  const openBookmark = useCallback(() => {
    gistStore.updateFile?.(
      filename,
      serializeBookmark({
        ...bookmark,
        mtime: Date.now(),
        clickCount: (bookmark.clickCount ?? 0) + 1,
      }),
      true
    );

    window.location.href = bookmark.url;
  }, [filename, bookmark]);

  return editMode ? (
    <EditBookmarkForm
      initialTitle={bookmark.title}
      initialUrl={bookmark.url}
      onCancel={toggleEditMode}
      onUpdate={updateBookmark}
    />
  ) : (
    <GridItem
      leftCol={<BookmarkIcon linkUrl={bookmark.url} onClick={openBookmark} />}
      row1={
        <Link url={bookmark.url} onClick={openBookmark}>
          {bookmark.title}
        </Link>
      }
      row2={
        gistStore.state !== 'locked' &&
        !zenMode && (
          <>
            <Button onClick={toggleEditMode}>
              <Icon type="pencil" />
              Edit
            </Button>
            <Button
              theme={deletable ? Theme.danger() : undefined}
              disabled={!deleteBookmark}
              onClick={deleteBookmark}
            >
              <Icon type="trash" />
              Delete
            </Button>{' '}
          </>
        )
      }
      background
      highlight={useTimer(1500, bookmark.mtime ?? bookmark.ctime)}
    />
  );
}

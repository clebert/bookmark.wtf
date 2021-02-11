import {Fragment, JSX, h} from 'preact';
import {useMemo} from 'preact/hooks';
import {ReadyGistStore, UpdatingGistStore} from '../hooks/use-gist-store';
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
  readonly gistStore: ReadyGistStore | UpdatingGistStore;
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
  const [editMode, toggleEditMode] = useToggle();

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

  const [deletable, toggleDeletable] = useToggle(3000);

  const deleteBookmark = useMemo(
    () =>
      !deletable
        ? toggleDeletable
        : gistStore.deleteFile
        ? () => gistStore.deleteFile(filename)
        : undefined,
    [gistStore, filename, deletable]
  );

  return editMode ? (
    <EditBookmarkForm
      initialTitle={bookmark.title}
      initialUrl={bookmark.url}
      onCancel={toggleEditMode}
      onUpdate={updateBookmark}
    />
  ) : (
    <GridItem
      leftCol={<BookmarkIcon linkUrl={bookmark.url} />}
      row1={<Link url={bookmark.url}>{bookmark.title}</Link>}
      row2={
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
          </Button>
        </>
      }
      background
      highlight={useTimer(1500, bookmark.mtime ?? bookmark.ctime)}
    />
  );
}

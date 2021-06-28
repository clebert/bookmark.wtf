import {Fragment, JSX, h} from 'preact';
import {useCallback} from 'preact/hooks';
import {useBookmarkItemView} from '../hooks/use-bookmark-item-view';
import {
  ForkingGistStore,
  LockedGistStore,
  ReadyGistStore,
  UpdatingGistStore,
} from '../hooks/use-gist-store';
import {useTimer} from '../hooks/use-timer';
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

  const view = useBookmarkItemView(gistStore, bookmarkFile);

  return view.state === 'editing' ? (
    <EditBookmarkForm
      initialTitle={bookmark.title}
      initialUrl={bookmark.url}
      onCancel={view.cancelEditing}
      onUpdate={view.updateBookmark}
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
        view.state === 'mutable' ? (
          <>
            <Button class="EditButton" onClick={view.startEditing}>
              <Icon type="pencil" standalone />
            </Button>

            <Button class="DeleteButton" onClick={view.startDeleting}>
              <Icon type="trash" standalone />
            </Button>
          </>
        ) : view.state === 'deleting' ? (
          <>
            <Button class="EditButton">
              <Icon type="pencil" standalone />
            </Button>

            <Button
              class="DeleteButton"
              theme="danger"
              onClick={view.deleteBookmark}
            >
              <Icon type="trash" />
              Delete
            </Button>
          </>
        ) : undefined
      }
      highlight={useTimer(1500, bookmark.mtime ?? bookmark.ctime)}
    />
  );
}

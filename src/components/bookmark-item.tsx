import type {
  ForkingGistStore,
  LockedGistStore,
  ReadyGistStore,
  UpdatingGistStore,
} from '../hooks/use-gist-store.js';
import type {Bookmark} from '../utils/parse-bookmark.js';
import type {JSX} from 'preact';

import {BookmarkIcon} from './bookmark-icon.js';
import {CopyBookmarkButton} from './copy-bookmark-button.js';
import {DeleteButton} from './delete-button.js';
import {EditBookmarkForm} from './edit-bookmark-form.js';
import {EditButton} from './edit-button.js';
import {GridItem} from './grid-item.js';
import {Icon} from './icon.js';
import {Link} from './link.js';
import {useTimer} from '../hooks/use-timer.js';
import {useToggle} from '../hooks/use-toggle.js';
import {serializeBookmark} from '../utils/serialize-bookmark.js';
import {useCallback, useMemo} from 'preact/hooks';

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
      !window.navigator.userAgent.includes(`Firefox`) &&
      `updateFile` in gistStore
    ) {
      gistStore.updateFile(
        filename,
        serializeBookmark({
          ...bookmark,
          clickCount: (bookmark.clickCount ?? 0) + 1,
        }),
        true,
      );
    }

    window.location.href = bookmark.url;
  }, [filename, bookmark]);

  const [editing, toggleEditing] = useToggle(false);

  const updateBookmark = useMemo(
    () =>
      `updateFile` in gistStore
        ? (title: string, url: string) => {
            gistStore.updateFile(
              filename,
              serializeBookmark({...bookmark, title, url, mtime: Date.now()}),
            );

            toggleEditing();
          }
        : undefined,
    [gistStore, filename, bookmark],
  );

  const [deleting, toggleDeleting] = useToggle(false, 3000);

  const deleteBookmark = useCallback(() => {
    if (`deleteFile` in gistStore) {
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
            <CopyBookmarkButton bookmark={bookmark} />
            <EditButton targetName="bookmark" />

            <DeleteButton
              targetName="bookmark"
              verbose
              action={gistStore.state === `ready` ? deleteBookmark : undefined}
            />
          </>
        ) : (
          <>
            <CopyBookmarkButton bookmark={bookmark} />

            <EditButton
              targetName="bookmark"
              action={gistStore.state === `ready` ? toggleEditing : undefined}
            />

            <DeleteButton
              targetName="bookmark"
              action={gistStore.state === `ready` ? toggleDeleting : undefined}
            />
          </>
        )
      }
      highlight={useTimer(1500, bookmark.mtime ?? bookmark.ctime)}
    />
  );
}

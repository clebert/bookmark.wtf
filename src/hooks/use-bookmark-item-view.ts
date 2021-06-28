import {useCallback, useEffect, useMemo, useState} from 'preact/hooks';
import {BookmarkFile} from '../components/bookmark-item';
import {serializeBookmark} from '../utils/serialize-bookmark';
import {
  ForkingGistStore,
  LockedGistStore,
  ReadyGistStore,
  UpdatingGistStore,
} from './use-gist-store';

export type BookmarkItemView =
  | ImmutableBookmarkItemView
  | MutableBookmarkItemView
  | EditingBookmarkItemView
  | DeletingBookmarkItemView;

export interface ImmutableBookmarkItemView {
  readonly state: 'immutable';
}

export interface MutableBookmarkItemView {
  readonly state: 'mutable';

  startEditing(): void;
  startDeleting(): void;
}

export interface EditingBookmarkItemView {
  readonly state: 'editing';

  cancelEditing(): void;
  updateBookmark(title: string, url: string): void;
}

export interface DeletingBookmarkItemView {
  readonly state: 'deleting';

  deleteBookmark(): void;
}

export function useBookmarkItemView(
  gistStore:
    | ReadyGistStore
    | UpdatingGistStore
    | LockedGistStore
    | ForkingGistStore,
  bookmarkFile: BookmarkFile
): BookmarkItemView {
  const {filename, bookmark} = bookmarkFile;
  const [editing, setEditing] = useState(false);
  const cancelEditing = useCallback(() => setEditing(false), []);
  const startEditing = useCallback(() => setEditing(true), []);
  const [deleting, setDeleting] = useState(false);
  const startDeleting = useCallback(() => setDeleting(true), []);

  useEffect(() => {
    if (!deleting) {
      return;
    }

    const timeoutId = setTimeout(() => setDeleting(false), 3000);

    return () => clearTimeout(timeoutId);
  }, [deleting]);

  const updateBookmark = useMemo(
    () =>
      'updateFile' in gistStore
        ? (title: string, url: string) => {
            gistStore.updateFile(
              filename,
              serializeBookmark({...bookmark, title, url, mtime: Date.now()})
            );

            setEditing(false);
          }
        : undefined,
    [gistStore, filename, bookmark]
  );

  const deleteBookmark = useMemo(
    () =>
      'deleteFile' in gistStore
        ? () => gistStore.deleteFile(filename)
        : undefined,
    [gistStore, filename]
  );

  return !updateBookmark || !deleteBookmark
    ? {state: 'immutable'}
    : editing
    ? {state: 'editing', cancelEditing, updateBookmark}
    : deleting
    ? {state: 'deleting', deleteBookmark}
    : {state: 'mutable', startEditing, startDeleting};
}

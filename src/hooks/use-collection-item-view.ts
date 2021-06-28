import {useCallback, useEffect, useMemo, useState} from 'preact/hooks';
import {ReadyGistsStore, UpdatingGistsStore} from './use-gists-store';

export type CollectionItemView =
  | ImmutableCollectionItemView
  | MutableCollectionItemView
  | EditingCollectionItemView
  | DeletingCollectionItemView;

export interface ImmutableCollectionItemView {
  readonly state: 'immutable';
}

export interface MutableCollectionItemView {
  readonly state: 'mutable';

  startEditing(): void;
  startDeleting(): void;
}

export interface EditingCollectionItemView {
  readonly state: 'editing';

  cancelEditing(): void;
  updateCollection(description: string): void;
}

export interface DeletingCollectionItemView {
  readonly state: 'deleting';

  deleteCollection(): void;
}

export function useCollectionItemView(
  gistsStore: ReadyGistsStore | UpdatingGistsStore,
  gistName: string
): CollectionItemView {
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

  const updateCollection = useMemo(
    () =>
      'updateGist' in gistsStore
        ? (newDescription: string) => {
            gistsStore.updateGist(gistName, newDescription);
            setEditing(false);
          }
        : undefined,
    [gistsStore, gistName]
  );

  const deleteCollection = useMemo(
    () =>
      'deleteGist' in gistsStore
        ? () => gistsStore.deleteGist(gistName)
        : undefined,
    [gistsStore, gistName]
  );

  return !updateCollection || !deleteCollection
    ? {state: 'immutable'}
    : editing
    ? {state: 'editing', cancelEditing, updateCollection}
    : deleting
    ? {state: 'deleting', deleteCollection}
    : {state: 'mutable', startEditing, startDeleting};
}

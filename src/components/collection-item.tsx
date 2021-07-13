import {JSX} from 'preact';
import {useCallback, useMemo} from 'preact/hooks';
import {ShallowGist} from '../apis/gists-api';
import {ReadyGistsStore, UpdatingGistsStore} from '../hooks/use-gists-store';
import {useTimer} from '../hooks/use-timer';
import {useToggle} from '../hooks/use-toggle';
import {AppTopics} from '../pub-sub/app-topics';
import {DeleteButton} from './delete-button';
import {EditButton} from './edit-button';
import {EditCollectionForm} from './edit-collection-form';
import {GridItem} from './grid-item';
import {Icon} from './icon';
import {Link} from './link';

export interface CollectionItemProps {
  readonly gistsStore: ReadyGistsStore | UpdatingGistsStore;
  readonly gist: ShallowGist;
}

export function CollectionItem({
  gistsStore,
  gist: {gistName, description, mtime},
}: CollectionItemProps): JSX.Element {
  const openCollection = useCallback(
    () => AppTopics.gistName.publish(gistName),
    [gistName]
  );

  const [editing, toggleEditing] = useToggle(false);

  const updateCollection = useMemo(
    () =>
      'updateGist' in gistsStore
        ? (newDescription: string) => {
            gistsStore.updateGist(gistName, newDescription);
            toggleEditing();
          }
        : undefined,
    [gistsStore, gistName]
  );

  const [deleting, toggleDeleting] = useToggle(false, 3000);

  const deleteCollection = useCallback(() => {
    if ('deleteGist' in gistsStore) {
      gistsStore.deleteGist(gistName);
    }
  }, [gistsStore, gistName]);

  return editing ? (
    <EditCollectionForm
      initialDescription={description ?? ''}
      onCancel={toggleEditing}
      onUpdate={updateCollection}
    />
  ) : (
    <GridItem
      class="CollectionItem"
      row1={
        <Link url={'/' + gistName} onClick={openCollection}>
          <Icon type="link" />
          {description ?? gistName}
        </Link>
      }
      row2={
        deleting ? (
          <>
            <EditButton targetName="collection" />

            <DeleteButton
              targetName="collection"
              verbose
              action={
                gistsStore.state === 'ready' ? deleteCollection : undefined
              }
            />
          </>
        ) : (
          <>
            <EditButton
              targetName="collection"
              action={gistsStore.state === 'ready' ? toggleEditing : undefined}
            />

            <DeleteButton
              targetName="collection"
              action={gistsStore.state === 'ready' ? toggleDeleting : undefined}
            />
          </>
        )
      }
      highlight={useTimer(1500, mtime)}
    />
  );
}

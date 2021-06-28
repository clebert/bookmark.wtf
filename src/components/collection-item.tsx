import {Fragment, JSX, h} from 'preact';
import {useCallback, useContext} from 'preact/hooks';
import {ShallowGist} from '../apis/gists-api';
import {ReadyGistsStore, UpdatingGistsStore} from '../hooks/use-gists-store';
import {HistoryContext} from '../hooks/use-history';
import {useTimer} from '../hooks/use-timer';
import {useToggle} from '../hooks/use-toggle';
import {changeGistName} from '../utils/change-gist-name';
import {Button} from './button';
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
  const history = useContext(HistoryContext);

  const openCollection = useCallback(
    () => history.push(changeGistName(gistName)),
    [gistName]
  );

  const [editing, toggleEditing] = useToggle(false);

  const updateCollection = useCallback(
    (newDescription: string) => {
      if ('updateGist' in gistsStore) {
        gistsStore.updateGist(gistName, newDescription);
        toggleEditing();
      }
    },
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
            <Button class="EditButton">
              <Icon type="pencil" standalone />
            </Button>

            <Button
              class="DeleteButton"
              theme="danger"
              onClick={deleteCollection}
            >
              <Icon type="trash" />
              Delete
            </Button>
          </>
        ) : (
          <>
            <Button
              class="EditButton"
              onClick={gistsStore.state === 'ready' ? toggleEditing : undefined}
            >
              <Icon type="pencil" standalone />
            </Button>

            <Button
              class="DeleteButton"
              onClick={
                gistsStore.state === 'ready' ? toggleDeleting : undefined
              }
            >
              <Icon type="trash" standalone />
            </Button>
          </>
        )
      }
      highlight={useTimer(1500, mtime)}
    />
  );
}

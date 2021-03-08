import {Fragment, JSX, h} from 'preact';
import {useCallback, useContext, useMemo} from 'preact/hooks';
import {ShallowGist} from '../apis/fetch-gists';
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
  readonly zenMode: boolean;
}

export function CollectionItem({
  gistsStore,
  gist: {gistName, description, mtime},
  zenMode,
}: CollectionItemProps): JSX.Element {
  const history = useContext(HistoryContext);

  const openCollection = useCallback(
    () => history.push(changeGistName(gistName)),
    [gistName]
  );

  const [editMode, toggleEditMode] = useToggle(false);

  const updateCollection = useMemo(
    () =>
      gistsStore.updateGist
        ? (newDescription: string) => {
            gistsStore.updateGist(gistName, newDescription);
            toggleEditMode();
          }
        : undefined,
    [gistsStore, gistName]
  );

  const [deletable, toggleDeletable] = useToggle(false, 3000);

  const deleteGist = useMemo(
    () =>
      !deletable
        ? toggleDeletable
        : gistsStore.deleteGist
        ? () => gistsStore.deleteGist(gistName)
        : undefined,
    [gistsStore, gistName, deletable]
  );

  return editMode ? (
    <EditCollectionForm
      initialDescription={description ?? ''}
      onCancel={toggleEditMode}
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
        !zenMode && (
          <>
            <Button onClick={toggleEditMode}>
              <Icon type="pencil" />
              Edit
            </Button>

            <Button
              class="DeleteButton"
              theme={deletable ? 'danger' : undefined}
              disabled={!deleteGist}
              onClick={deleteGist}
            >
              <Icon type="trash" />
              Delete
            </Button>
          </>
        )
      }
      highlight={useTimer(1500, mtime)}
    />
  );
}

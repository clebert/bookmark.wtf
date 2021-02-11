import {Fragment, JSX, h} from 'preact';
import {useCallback, useContext, useMemo} from 'preact/hooks';
import {ShallowGist} from '../apis/fetch-gists';
import {ReadyGistsStore, UpdatingGistsStore} from '../hooks/use-gists-store';
import {HistoryContext} from '../hooks/use-history';
import {useTimer} from '../hooks/use-timer';
import {useToggle} from '../hooks/use-toggle';
import {Theme} from '../utils/theme';
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
    () => history.push({type: 'pathname', pathname: '/' + gistName}),
    [gistName]
  );

  const [editMode, toggleEditMode] = useToggle();

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

  const [deletable, toggleDeletable] = useToggle(3000);

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
      row1={
        <Link url={'/' + gistName} onClick={openCollection}>
          {description ?? gistName}
        </Link>
      }
      row2={
        <>
          <Button onClick={toggleEditMode}>
            <Icon type="pencil" />
            Edit
          </Button>

          <Button
            theme={deletable ? Theme.danger() : undefined}
            disabled={!deleteGist}
            onClick={deleteGist}
          >
            <Icon type="trash" />
            Delete
          </Button>
        </>
      }
      background
      highlight={useTimer(1500, mtime)}
    />
  );
}

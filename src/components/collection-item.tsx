import {Fragment, JSX, h} from 'preact';
import {useCallback, useContext} from 'preact/hooks';
import {ShallowGist} from '../apis/gists-api';
import {useCollectionItemView} from '../hooks/use-collection-item-view';
import {ReadyGistsStore, UpdatingGistsStore} from '../hooks/use-gists-store';
import {HistoryContext} from '../hooks/use-history';
import {useTimer} from '../hooks/use-timer';
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

  const view = useCollectionItemView(gistsStore, gistName);

  return view.state === 'editing' ? (
    <EditCollectionForm
      initialDescription={description ?? ''}
      onCancel={view.cancelEditing}
      onUpdate={view.updateCollection}
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
              onClick={view.deleteCollection}
            >
              <Icon type="trash" />
              Delete
            </Button>
          </>
        ) : undefined
      }
      highlight={useTimer(1500, mtime)}
    />
  );
}

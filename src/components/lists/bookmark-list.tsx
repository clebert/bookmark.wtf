import {
  faEdit,
  faExclamationTriangle,
  faLock,
  faPlus,
  faSpinner,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import {
  BulmaColumn,
  BulmaColumnBreakpointSizes,
} from '../../bulma/bulma-column';
import {BulmaColumns} from '../../bulma/bulma-columns';
import {BulmaContent} from '../../bulma/bulma-content';
import {BulmaIcon} from '../../bulma/bulma-icon';
import {BulmaMediaObject} from '../../bulma/bulma-media-object';
import {BulmaTag} from '../../bulma/bulma-tag';
import {BulmaTags} from '../../bulma/bulma-tags';
import {BulmaText} from '../../bulma/bulma-text';
import {BulmaTitle} from '../../bulma/bulma-title';
import {AuthorizedAuthState} from '../../hooks/use-auth-state';
import {SetGistNameState} from '../../hooks/use-gist-name-state';
import {useGistState} from '../../hooks/use-gist-state';
import {HistoryContext} from '../../hooks/use-history';
import {ReceivedReceiverState} from '../../hooks/use-receiver-state';
import {BookmarkBackend} from '../../models/bookmark';
import {GetGist_viewer_gist} from '../../queries/__generated__/GetGist';
import {createBookmarklet} from '../../utils/create-bookmarklet';
import {createRandomValue} from '../../utils/create-random-value';
import {toggle} from '../../utils/toggle';
import {AddBookmarkModal} from '../modals/add-bookmark-modal';
import {EditDescriptionModal} from '../modals/edit-description-modal';
import {BookmarkListItem} from './bookmark-list-item';

export interface BookmarkListProps {
  readonly authState: AuthorizedAuthState;
  readonly userState: ReceivedReceiverState<string>;
  readonly gistNameState: SetGistNameState;
  readonly gistDataState: ReceivedReceiverState<GetGist_viewer_gist>;
}

const breakpointSizes: BulmaColumnBreakpointSizes = {
  tablet: '6',
  desktop: '4',
  fullHd: '3',
};

const bookmarkBackend = new BookmarkBackend();

export function BookmarkList({
  authState,
  userState,
  gistNameState,
  gistDataState,
}: BookmarkListProps): JSX.Element {
  const gistState = useGistState(
    authState,
    gistNameState,
    gistDataState,
    bookmarkBackend
  );

  const [deletionConfirmed, setDeletionConfirmed] = React.useState(false);

  const deleteGist = React.useCallback(() => {
    if (deletionConfirmed) {
      gistState.deleteGist?.();
    } else {
      setDeletionConfirmed(true);
    }
  }, [gistState, deletionConfirmed]);

  const [addModal, setAddModal] = React.useState(false);
  const closeAddModal = React.useCallback(() => setAddModal(false), []);
  const [editModal, setEditModal] = React.useState(false);
  const toggleEditModal = React.useCallback(() => setEditModal(toggle), []);

  const addBookmark = React.useCallback((event: React.MouseEvent) => {
    setAddModal(true);
    event.preventDefault();
  }, []);

  const createBookmark = React.useCallback(
    (title: string, url: string) => {
      gistState.createFile?.(createRandomValue() + '.md', {
        title,
        url,
        properties: {ctime: Date.now()},
      });

      setAddModal(false);
    },
    [gistState]
  );

  const updateDescription = React.useCallback(
    (description: string) => {
      if (description !== gistState.description) {
        gistState.updateGist?.(description);
      }

      setEditModal(false);
    },
    [gistState]
  );

  const bookmarklet = React.useMemo(
    () => createBookmarklet(gistNameState.gistName),
    []
  );

  const addBookmarkTagRef = React.useRef<HTMLAnchorElement>(null);

  React.useEffect(() => {
    if (addBookmarkTagRef.current) {
      addBookmarkTagRef.current.setAttribute('href', bookmarklet);
    }
  });

  const isLocked = React.useMemo(() => gistState.owner !== userState.value, []);
  const history = React.useContext(HistoryContext);

  const initialTitle = React.useMemo(
    () => new URLSearchParams(history.search).get('title') ?? '',
    [history]
  );

  const initialUrl = React.useMemo(
    () => new URLSearchParams(history.search).get('url') ?? '',
    [history]
  );

  React.useEffect(() => {
    if (initialTitle && initialUrl) {
      if (isLocked) {
        history.replace({search: ''});
      } else {
        setAddModal(true);
      }
    }
  }, []);

  React.useEffect(() => {
    if (addModal && initialTitle && initialUrl) {
      return () => history.replace({search: ''});
    }

    return;
  }, [addModal]);

  if (gistState.status === 'failed') {
    return (
      <BulmaText color="danger">
        <BulmaIcon definition={faExclamationTriangle}>
          Oops! Could not update the gist.
        </BulmaIcon>
      </BulmaText>
    );
  }

  return (
    <>
      {addModal && (
        <AddBookmarkModal
          initialTitle={initialTitle}
          initialUrl={initialUrl}
          onCreateBookmark={createBookmark}
          onCancel={closeAddModal}
        />
      )}

      {editModal && (
        <EditDescriptionModal
          initialDescription={gistState.description}
          onUpdateDescription={updateDescription}
          onCancel={toggleEditModal}
        />
      )}

      <BulmaTitle size="4" isSubtitle>
        {gistState.description || gistNameState.gistName}

        {gistState.status === 'ready' && !isLocked && (
          <BulmaTag color="white" isRounded onClick={toggleEditModal}>
            <BulmaIcon definition={faEdit}>Edit description</BulmaIcon>
          </BulmaTag>
        )}
      </BulmaTitle>

      <BulmaColumns isMultiline>
        <BulmaColumn breakpointSizes={breakpointSizes}>
          <BulmaMediaObject>
            <BulmaContent>
              {gistState.files.length === 0
                ? 'No bookmarks found.'
                : gistState.files.length === 1
                ? `Showing ${gistState.files.length} bookmark.`
                : `Showing ${gistState.files.length} bookmarks.`}
            </BulmaContent>

            {gistState.status === 'ready' && !isLocked && (
              <BulmaTags>
                <BulmaTag
                  ref={addBookmarkTagRef}
                  color="link"
                  isLight
                  isRounded
                  onClick={addBookmark}
                >
                  <BulmaIcon definition={faPlus}>Add bookmark</BulmaIcon>
                </BulmaTag>

                {gistState.files.length === 0 && (
                  <BulmaTag
                    color={deletionConfirmed ? 'danger' : 'white'}
                    isRounded
                    onClick={deleteGist}
                  >
                    <BulmaIcon definition={faTrashAlt}>
                      {deletionConfirmed ? 'Yes, Delete gist!' : 'Delete gist'}
                    </BulmaIcon>
                  </BulmaTag>
                )}
              </BulmaTags>
            )}

            {isLocked && (
              <BulmaTag
                href={'https://gist.github.com/' + gistState.owner}
                color="link"
                isLight
                isRounded
              >
                <BulmaIcon definition={faLock}>
                  Owned by {gistState.owner}
                </BulmaIcon>
              </BulmaTag>
            )}

            {gistState.status === 'updating' && (
              <BulmaTag color="warning" isLight isRounded>
                <BulmaIcon definition={faSpinner}>Updating</BulmaIcon>
              </BulmaTag>
            )}
          </BulmaMediaObject>
        </BulmaColumn>

        {gistState.files.map((file) => (
          <BulmaColumn key={file.filename} breakpointSizes={breakpointSizes}>
            <BookmarkListItem
              gistState={gistState}
              gistFile={file}
              isLocked={isLocked}
            />
          </BulmaColumn>
        ))}
      </BulmaColumns>
    </>
  );
}

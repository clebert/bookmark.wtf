import {
  BulmaColumn,
  BulmaColumnBreakpointSizes,
  BulmaColumns,
  BulmaContent,
  BulmaIcon,
  BulmaMediaObject,
  BulmaTag,
  BulmaTags,
  BulmaText,
  BulmaTitle,
} from '@clebert/bulma-react';
import {
  faEdit,
  faExclamationTriangle,
  faLock,
  faPlus,
  faSpinner,
  faToggleOff,
  faToggleOn,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import * as React from 'react';
import {useConfirmation} from '../../hooks/use-confirmation';
import {GistDependencies, useGist} from '../../hooks/use-gist';
import {HistoryContext} from '../../hooks/use-history';
import {BookmarkBackend} from '../../models/bookmark';
import {createBookmarklet} from '../../utils/create-bookmarklet';
import {createRandomValue} from '../../utils/create-random-value';
import {toggle} from '../../utils/toggle';
import {AddBookmarkModal} from '../modals/add-bookmark-modal';
import {EditDescriptionModal} from '../modals/edit-description-modal';
import {BookmarkListItem} from './bookmark-list-item';

export interface BookmarkListProps extends GistDependencies {}

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
  const gistState = useGist(
    {authState, userState, gistNameState, gistDataState},
    bookmarkBackend
  );

  const [deletionConfirmed, setDeletionConfirmed] = useConfirmation();

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
      if (gistState.status === 'locked') {
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

  const [editable, setEditable] = React.useState(false);
  const toggleEditable = React.useCallback(() => setEditable(toggle), []);

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
          bookmarklet={bookmarklet}
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

        {gistState.status === 'ready' && (
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

            {gistState.status === 'ready' && (
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

                {gistState.files.length === 0 ? (
                  <BulmaTag
                    color={deletionConfirmed ? 'danger' : 'white'}
                    isRounded
                    onClick={deleteGist}
                  >
                    <BulmaIcon definition={faTrashAlt}>
                      {deletionConfirmed ? 'Yes, Delete gist!' : 'Delete gist'}
                    </BulmaIcon>
                  </BulmaTag>
                ) : (
                  <BulmaTag color="white" isRounded onClick={toggleEditable}>
                    <BulmaIcon definition={editable ? faToggleOn : faToggleOff}>
                      Edit bookmarks
                    </BulmaIcon>
                  </BulmaTag>
                )}
              </BulmaTags>
            )}

            {gistState.status === 'locked' && (
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
              editable={editable}
            />
          </BulmaColumn>
        ))}
      </BulmaColumns>
    </>
  );
}

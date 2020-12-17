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
} from '@clebert/bulma-preact';
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
import {Fragment, JSX, h} from 'preact';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';
import {useConfirmation} from '../../hooks/use-confirmation';
import {GistDependencies, useGist} from '../../hooks/use-gist';
import {HistoryContext} from '../../hooks/use-history';
import {useSearchTerm} from '../../hooks/use-search-term';
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

  const searchTerm = useSearchTerm();

  const filteredFiles = useMemo(
    () =>
      gistState.files?.filter(
        (file) =>
          !searchTerm.regex ||
          searchTerm.regex.test(file.model.title) ||
          searchTerm.regex.test(file.model.url)
      ) ?? [],
    [gistState, searchTerm]
  );

  const [deletionConfirmed, setDeletionConfirmed] = useConfirmation();

  const deleteGist = useCallback(() => {
    if (deletionConfirmed) {
      gistState.deleteGist?.();
    } else {
      setDeletionConfirmed(true);
    }
  }, [gistState, deletionConfirmed]);

  const [addModal, setAddModal] = useState(false);
  const closeAddModal = useCallback(() => setAddModal(false), []);
  const [editModal, setEditModal] = useState(false);
  const toggleEditModal = useCallback(() => setEditModal(toggle), []);

  const addBookmark = useCallback((event: JSX.TargetedEvent) => {
    setAddModal(true);
    event.preventDefault();
  }, []);

  const createBookmark = useCallback(
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

  const updateDescription = useCallback(
    (description: string) => {
      if (description !== gistState.description) {
        gistState.updateGist?.(description);
      }

      setEditModal(false);
    },
    [gistState]
  );

  const bookmarklet = useMemo(
    () => createBookmarklet(gistNameState.gistName),
    []
  );

  const addBookmarkTagRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (addBookmarkTagRef.current) {
      addBookmarkTagRef.current.setAttribute('href', bookmarklet);
    }
  });

  const history = useContext(HistoryContext);

  const initialTitle = useMemo(
    () => new URL(history.url).searchParams.get('title') ?? '',
    []
  );

  const initialUrl = useMemo(
    () => new URL(history.url).searchParams.get('url') ?? '',
    []
  );

  useEffect(() => {
    history.scheduleUpdate(
      'replace',
      {type: 'param', key: 'title'},
      {type: 'param', key: 'url'}
    );

    setAddModal(Boolean(initialUrl && gistState.status !== 'locked'));
  }, []);

  const [editable, setEditable] = useState(false);
  const toggleEditable = useCallback(() => setEditable(toggle), []);

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
              {filteredFiles.length === 0
                ? 'No bookmarks found.'
                : filteredFiles.length === 1
                ? `Showing ${filteredFiles.length} bookmark.`
                : `Showing ${filteredFiles.length} bookmarks.`}
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
                ) : filteredFiles.length > 0 ? (
                  <BulmaTag color="white" isRounded onClick={toggleEditable}>
                    <BulmaIcon definition={editable ? faToggleOn : faToggleOff}>
                      Edit bookmarks
                    </BulmaIcon>
                  </BulmaTag>
                ) : undefined}
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

        {filteredFiles.map((file) => (
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

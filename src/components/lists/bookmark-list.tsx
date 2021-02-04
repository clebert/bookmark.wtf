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
import {useCallback, useEffect, useMemo, useRef, useState} from 'preact/hooks';
import {useBookmarkInit} from '../../hooks/use-bookmark-init';
import {useConfirmation} from '../../hooks/use-confirmation';
import {GistDependencies, useGist} from '../../hooks/use-gist';
import {useSearchTerm} from '../../hooks/use-search-term';
import {BookmarkAdapter} from '../../models/bookmark';
import {createBookmarklet} from '../../utils/create-bookmarklet';
import {createRandomValue} from '../../utils/create-random-value';
import {preventDefault} from '../../utils/prevent-default';
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

const bookmarkAdapter = new BookmarkAdapter();

export function BookmarkList({
  auth,
  userReceiver,
  gistSelection,
  gistDataReceiver,
}: BookmarkListProps): JSX.Element {
  const gist = useGist(
    {auth, userReceiver, gistSelection, gistDataReceiver},
    bookmarkAdapter
  );

  const searchTerm = useSearchTerm();

  const filteredFiles = useMemo(
    () =>
      gist.files?.filter(
        (file) =>
          !searchTerm.regex ||
          searchTerm.regex.test(file.model.title) ||
          searchTerm.regex.test(file.model.url)
      ) ?? [],
    [gist, searchTerm]
  );

  const [deletionConfirmed, setDeletionConfirmed] = useConfirmation();

  const deleteGist = useCallback(() => {
    if (deletionConfirmed) {
      gist.deleteGist?.();
    } else {
      setDeletionConfirmed(true);
    }
  }, [gist, deletionConfirmed]);

  const bookmarkInit = useBookmarkInit();

  const [addModal, setAddModal] = useState<'init' | boolean>(
    bookmarkInit && gist.state !== 'locked' ? 'init' : false
  );

  const closeAddModal = useCallback(() => setAddModal(false), []);
  const [editModal, setEditModal] = useState(false);
  const toggleEditModal = useCallback(() => setEditModal(toggle), []);

  const addBookmark = useCallback(
    preventDefault(() => setAddModal(true)),
    []
  );

  const createBookmark = useCallback(
    (title: string, url: string) => {
      gist.createFile?.(createRandomValue() + '.md', {
        title,
        url,
        properties: {ctime: Date.now()},
      });

      setAddModal(false);
    },
    [gist]
  );

  const updateDescription = useCallback(
    (description: string) => {
      if (description !== gist.description) {
        gist.updateGist?.(description);
      }

      setEditModal(false);
    },
    [gist]
  );

  const bookmarklet = useMemo(
    () => createBookmarklet(gistSelection.gistName),
    []
  );

  const addBookmarkTagRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (addBookmarkTagRef.current) {
      addBookmarkTagRef.current.setAttribute('href', bookmarklet.url);
    }
  });

  const [editable, setEditable] = useState(false);
  const toggleEditable = useCallback(() => setEditable(toggle), []);

  if (gist.state === 'failed') {
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
          bookmarklet={bookmarklet}
          bookmarkInit={addModal === 'init' ? bookmarkInit : undefined}
          onCreateBookmark={createBookmark}
          onCancel={closeAddModal}
        />
      )}

      {editModal && (
        <EditDescriptionModal
          initialDescription={gist.description}
          onUpdateDescription={updateDescription}
          onCancel={toggleEditModal}
        />
      )}

      <BulmaTitle size="4" isSubtitle>
        {gist.description || gistSelection.gistName}

        {gist.state === 'idle' && (
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

            {gist.state === 'idle' && (
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

                {gist.files.length === 0 ? (
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

            {gist.state === 'locked' && (
              <BulmaTag
                href={'https://gist.github.com/' + gist.owner}
                color="link"
                isLight
                isRounded
              >
                <BulmaIcon definition={faLock}>Owned by {gist.owner}</BulmaIcon>
              </BulmaTag>
            )}

            {gist.state === 'updating' && (
              <BulmaTag color="warning" isLight isRounded>
                <BulmaIcon definition={faSpinner}>Updating</BulmaIcon>
              </BulmaTag>
            )}
          </BulmaMediaObject>
        </BulmaColumn>

        {filteredFiles.map((file) => (
          <BulmaColumn key={file.filename} breakpointSizes={breakpointSizes}>
            <BookmarkListItem gist={gist} gistFile={file} editable={editable} />
          </BulmaColumn>
        ))}
      </BulmaColumns>
    </>
  );
}

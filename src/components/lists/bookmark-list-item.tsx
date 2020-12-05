import {
  BulmaIcon,
  BulmaMediaObject,
  BulmaTag,
  BulmaTags,
  BulmaText,
} from '@clebert/bulma-preact';
import {faEdit, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {Fragment, JSX, h} from 'preact';
import {useCallback, useState} from 'preact/hooks';
import {useConfirmation} from '../../hooks/use-confirmation';
import {
  GistFile,
  LockedGistState,
  ReadyGistState,
  UpdatingGistState,
} from '../../hooks/use-gist';
import {Bookmark} from '../../models/bookmark';
import {toggle} from '../../utils/toggle';
import {EditBookmarkModal} from '../modals/edit-bookmark-modal';
import {BookmarkListItemIcon} from './bookmark-list-item-icon';

export interface BookmarkListItemProps {
  readonly gistState:
    | ReadyGistState<Bookmark>
    | UpdatingGistState<Bookmark>
    | LockedGistState<Bookmark>;

  readonly gistFile: GistFile<Bookmark>;
  readonly editable: boolean;
}

export function BookmarkListItem({
  gistState,
  gistFile,
  editable,
}: BookmarkListItemProps): JSX.Element {
  const [editModal, setEditModal] = useState(false);
  const toggleEditModal = useCallback(() => setEditModal(toggle), []);

  const updateBookmark = useCallback(
    (title: string, url: string) => {
      if (title !== gistFile.model.title || url !== gistFile.model.url) {
        gistState.updateFile?.(gistFile, {
          title,
          url,
          properties: {...gistFile.model.properties, mtime: Date.now()},
        });
      }

      setEditModal(false);
    },
    [gistState, gistFile]
  );

  const [deletionConfirmed, setDeletionConfirmed] = useConfirmation();

  const deleteBookmark = useCallback(() => {
    if (deletionConfirmed) {
      gistState.deleteFile?.(gistFile);
    } else {
      setDeletionConfirmed(true);
    }
  }, [gistState, gistFile, deletionConfirmed]);

  const countBookmarkClick = useCallback(() => {
    const clickCount = (gistFile.model.properties.clickCount ?? 0) + 1;
    const properties = {...gistFile.model.properties, clickCount};

    gistState.updateFile?.(gistFile, {...gistFile.model, properties}, true);
  }, [gistState, gistFile]);

  return (
    <>
      {editModal && (
        <EditBookmarkModal
          initialTitle={gistFile.model.title}
          initialUrl={gistFile.model.url}
          onUpdateBookmark={updateBookmark}
          onCancel={toggleEditModal}
        />
      )}

      <BulmaMediaObject
        left={
          <BookmarkListItemIcon
            url={gistFile.model.url}
            onClick={countBookmarkClick}
          />
        }
      >
        <BulmaText
          href={gistFile.model.url}
          tabIndex={-1}
          onClick={countBookmarkClick}
        >
          {gistFile.model.title}
        </BulmaText>

        {gistState.status === 'ready' && editable && (
          <BulmaTags>
            <BulmaTag color="white" isRounded onClick={toggleEditModal}>
              <BulmaIcon definition={faEdit}>Edit</BulmaIcon>
            </BulmaTag>

            <BulmaTag
              color={deletionConfirmed ? 'danger' : 'white'}
              isRounded
              onClick={deleteBookmark}
            >
              <BulmaIcon definition={faTrashAlt}>
                {deletionConfirmed ? 'Yes, Delete!' : 'Delete'}
              </BulmaIcon>
            </BulmaTag>
          </BulmaTags>
        )}
      </BulmaMediaObject>
    </>
  );
}

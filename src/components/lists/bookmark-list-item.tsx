import {faEdit, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import {BulmaContent} from '../../bulma/bulma-content';
import {BulmaIcon} from '../../bulma/bulma-icon';
import {BulmaImage} from '../../bulma/bulma-image';
import {BulmaMediaObject} from '../../bulma/bulma-media-object';
import {BulmaTag} from '../../bulma/bulma-tag';
import {BulmaTags} from '../../bulma/bulma-tags';
import {BulmaText} from '../../bulma/bulma-text';
import {
  GistFile,
  ReadyGistState,
  UpdatingGistState,
} from '../../hooks/use-gist-state';
import {Bookmark} from '../../models/bookmark';
import {createFaviconUrl} from '../../utils/create-favicon-url';
import {toggle} from '../../utils/toggle';
import {EditBookmarkModal} from '../modals/edit-bookmark-modal';

export interface BookmarkListItemProps {
  readonly gistState: ReadyGistState<Bookmark> | UpdatingGistState<Bookmark>;
  readonly gistFile: GistFile<Bookmark>;
  readonly editable: boolean;
}

export function BookmarkListItem({
  gistState,
  gistFile,
  editable,
}: BookmarkListItemProps): JSX.Element {
  const faviconUrl = React.useMemo(() => createFaviconUrl(gistFile.model.url), [
    gistFile,
  ]);

  const defaultFaviconUrl = React.useMemo(
    () => createFaviconUrl('https://example.com'),
    []
  );

  const [editModal, setEditModal] = React.useState(false);
  const toggleEditModal = React.useCallback(() => setEditModal(toggle), []);

  const updateBookmark = React.useCallback(
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

  const [deletionConfirmed, setDeletionConfirmed] = React.useState(false);

  const deleteBookmark = React.useCallback(() => {
    if (deletionConfirmed) {
      gistState.deleteFile?.(gistFile);
    } else {
      setDeletionConfirmed(true);
    }
  }, [gistState, gistFile, deletionConfirmed]);

  const countBookmarkClick = React.useCallback(() => {
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
          <a href={gistFile.model.url} onClick={countBookmarkClick}>
            <BulmaImage
              dimension="64x64"
              defaultSrc={defaultFaviconUrl}
              src={faviconUrl}
            />
          </a>
        }
      >
        <BulmaContent>
          <BulmaText
            href={gistFile.model.url}
            tabIndex={-1}
            onClick={countBookmarkClick}
          >
            {gistFile.model.title}
          </BulmaText>
        </BulmaContent>

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

import {faPlus} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import {BulmaButton} from '../../bulma/bulma-button';
import {BulmaContent} from '../../bulma/bulma-content';
import {BulmaField} from '../../bulma/bulma-field';
import {BulmaIcon} from '../../bulma/bulma-icon';
import {BulmaInput} from '../../bulma/bulma-input';
import {BulmaModalCard} from '../../bulma/bulma-modal-card';
import {BulmaTag} from '../../bulma/bulma-tag';
import {useInputCallback} from '../../hooks/use-input-callback';

export interface AddBookmarkModalProps {
  readonly initialTitle: string;
  readonly initialUrl: string;
  readonly bookmarklet: string;

  onCreateBookmark(title: string, url: string): void;
  onCancel(): void;
}

export function AddBookmarkModal({
  initialTitle,
  initialUrl,
  bookmarklet,
  onCreateBookmark,
  onCancel,
}: AddBookmarkModalProps): JSX.Element {
  const [title, setTitle] = React.useState(initialTitle);
  const [url, setUrl] = React.useState(initialUrl);

  const createBookmark = React.useCallback(
    (event: React.FormEvent) => {
      onCreateBookmark(title, url);
      event.preventDefault();
    },
    [onCreateBookmark, title, url]
  );

  const addBookmarkTagRef = React.useRef<HTMLAnchorElement>(null);

  React.useEffect(() => {
    if (addBookmarkTagRef.current) {
      addBookmarkTagRef.current.setAttribute('href', bookmarklet);
    }
  });

  const nop = React.useCallback(
    (event: React.MouseEvent) => event.preventDefault(),
    []
  );

  return (
    <form onSubmit={createBookmark}>
      <BulmaModalCard
        title="Add a new bookmark."
        footer={
          <BulmaField isGrouped>
            <BulmaButton type="submit" color="success">
              Create bookmark
            </BulmaButton>

            <BulmaButton color="text" onClick={onCancel}>
              Cancel
            </BulmaButton>
          </BulmaField>
        }
        onBackgroundClick={onCancel}
      >
        <BulmaField>
          <BulmaInput
            placeholder="Enter title"
            value={title}
            isAutoFocused
            isRequired
            onChange={useInputCallback(setTitle)}
          />
        </BulmaField>

        <BulmaField>
          <BulmaInput
            type="url"
            placeholder="Enter URL"
            value={url}
            isRequired
            onChange={useInputCallback(setUrl)}
          />
        </BulmaField>

        <BulmaContent isHidden="touch">
          <b>Tip: </b>You can save the bookmarklet{' '}
          <BulmaTag
            ref={addBookmarkTagRef}
            color="link"
            isLight
            isRounded
            onClick={nop}
          >
            <BulmaIcon definition={faPlus}>Add bookmark</BulmaIcon>
          </BulmaTag>{' '}
          in the Favorites bar of your browser. This allows you to add new
          bookmarks without having to enter the title and URL yourself.
        </BulmaContent>
      </BulmaModalCard>
    </form>
  );
}

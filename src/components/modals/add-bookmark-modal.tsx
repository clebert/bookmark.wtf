import React from 'react';
import {BulmaButton} from '../../bulma/bulma-button';
import {BulmaField} from '../../bulma/bulma-field';
import {BulmaInput} from '../../bulma/bulma-input';
import {BulmaModalCard} from '../../bulma/bulma-modal-card';
import {useInputCallback} from '../../hooks/use-input-callback';

export interface AddBookmarkModalProps {
  readonly initialTitle: string;
  readonly initialUrl: string;

  onCreateBookmark(title: string, url: string): void;
  onCancel(): void;
}

export function AddBookmarkModal({
  initialTitle,
  initialUrl,
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
      </BulmaModalCard>
    </form>
  );
}

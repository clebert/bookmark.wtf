import React from 'react';
import {BulmaButton} from '../../bulma/bulma-button';
import {BulmaField} from '../../bulma/bulma-field';
import {BulmaInput} from '../../bulma/bulma-input';
import {BulmaModalCard} from '../../bulma/bulma-modal-card';
import {useInputCallback} from '../../hooks/use-input-callback';

export interface EditBookmarkModalProps {
  readonly initialTitle: string;
  readonly initialUrl: string;

  onUpdateBookmark(title: string, url: string): void;
  onCancel(): void;
}

export function EditBookmarkModal({
  initialTitle,
  initialUrl,
  onUpdateBookmark,
  onCancel,
}: EditBookmarkModalProps): JSX.Element {
  const [title, setTitle] = React.useState(initialTitle);
  const [url, setUrl] = React.useState(initialUrl);

  const updateBookmark = React.useCallback(
    (event: React.FormEvent) => {
      onUpdateBookmark(title, url);
      event.preventDefault();
    },
    [onUpdateBookmark, title, url]
  );

  return (
    <form onSubmit={updateBookmark}>
      <BulmaModalCard
        title="Edit the bookmark."
        footer={
          <BulmaField isGrouped>
            <BulmaButton type="submit" color="success">
              Update bookmark
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

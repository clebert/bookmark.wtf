import {
  BulmaButton,
  BulmaField,
  BulmaInput,
  BulmaModalCard,
} from '@clebert/bulma-preact';
import {JSX, h} from 'preact';
import {useCallback, useState} from 'preact/hooks';
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
  const [title, setTitle] = useState(initialTitle);
  const [url, setUrl] = useState(initialUrl);

  const updateBookmark = useCallback(
    (event: JSX.TargetedEvent) => {
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

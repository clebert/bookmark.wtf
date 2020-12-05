import {
  BulmaButton,
  BulmaField,
  BulmaInput,
  BulmaModalCard,
} from '@clebert/bulma-preact';
import {JSX, h} from 'preact';
import {useCallback, useMemo, useState} from 'preact/hooks';
import {useInputCallback} from '../../hooks/use-input-callback';
import {parseGistName} from '../../utils/parse-gist-name';

export interface OpenGistModalProps {
  onOpenGist(gistName: string): void;
  onCancel(): void;
}

export function OpenGistModal({
  onOpenGist,
  onCancel,
}: OpenGistModalProps): JSX.Element {
  const [gistUrl, setGistUrl] = useState('');
  const gistName = useMemo(() => parseGistName(gistUrl), [gistUrl]);

  const openGist = useCallback(
    (event: JSX.TargetedEvent) => {
      if (gistName) {
        onOpenGist(gistName);
      }

      event.preventDefault();
    },
    [onOpenGist, gistName]
  );

  return (
    <form onSubmit={openGist}>
      <BulmaModalCard
        title="Open an existing gist."
        footer={
          <BulmaField isGrouped>
            <BulmaButton type="submit" color="success">
              Open gist
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
            type="url"
            placeholder="Enter URL"
            color={gistUrl && !gistName ? 'danger' : undefined}
            value={gistUrl}
            isAutoFocused
            isRequired
            onChange={useInputCallback(setGistUrl)}
          />
        </BulmaField>
      </BulmaModalCard>
    </form>
  );
}

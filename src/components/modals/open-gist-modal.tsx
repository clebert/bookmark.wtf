import React from 'react';
import {BulmaButton} from '../../bulma/bulma-button';
import {BulmaField} from '../../bulma/bulma-field';
import {BulmaInput} from '../../bulma/bulma-input';
import {BulmaModalCard} from '../../bulma/bulma-modal-card';
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
  const [gistUrl, setGistUrl] = React.useState('');
  const gistName = React.useMemo(() => parseGistName(gistUrl), [gistUrl]);

  const openGist = React.useCallback(
    (event: React.FormEvent) => {
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

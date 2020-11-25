import React from 'react';
import {BulmaButton} from '../../bulma/bulma-button';
import {BulmaField} from '../../bulma/bulma-field';
import {BulmaInput} from '../../bulma/bulma-input';
import {BulmaModalCard} from '../../bulma/bulma-modal-card';
import {useInputCallback} from '../../hooks/use-input-callback';

export interface OpenGistModalProps {
  onOpenGist(gistName: string): void;
  onCancel(): void;
}

export function OpenGistModal({
  onOpenGist,
  onCancel,
}: OpenGistModalProps): JSX.Element {
  const [gistName, setGistName] = React.useState('');

  const openGist = React.useCallback(
    (event: React.FormEvent) => {
      onOpenGist(gistName);
      event.preventDefault();
    },
    [onOpenGist, gistName]
  );

  return (
    <form onSubmit={openGist}>
      <BulmaModalCard
        title="Open a gist."
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
            placeholder="Enter name"
            value={gistName}
            isAutoFocused
            isRequired
            onChange={useInputCallback(setGistName)}
          />
        </BulmaField>
      </BulmaModalCard>
    </form>
  );
}

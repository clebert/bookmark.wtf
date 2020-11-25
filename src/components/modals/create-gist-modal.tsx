import React from 'react';
import {BulmaButton} from '../../bulma/bulma-button';
import {BulmaField} from '../../bulma/bulma-field';
import {BulmaInput} from '../../bulma/bulma-input';
import {BulmaModalCard} from '../../bulma/bulma-modal-card';
import {useInputCallback} from '../../hooks/use-input-callback';

export interface CreateGistModalProps {
  onCreateGist(description: string): void;
  onCancel(): void;
}

export function CreateGistModal({
  onCreateGist,
  onCancel,
}: CreateGistModalProps): JSX.Element {
  const [description, setDescription] = React.useState('');

  const createGist = React.useCallback(
    (event: React.FormEvent) => {
      onCreateGist(description);
      event.preventDefault();
    },
    [onCreateGist, description]
  );

  return (
    <form onSubmit={createGist}>
      <BulmaModalCard
        title="Create a new gist."
        footer={
          <BulmaField isGrouped>
            <BulmaButton type="submit" color="success">
              Create gist
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
            placeholder="Enter description"
            value={description}
            isAutoFocused
            isRequired
            onChange={useInputCallback(setDescription)}
          />
        </BulmaField>
      </BulmaModalCard>
    </form>
  );
}

import {BulmaButton} from '@clebert/bulma-react/lib/bulma-button';
import {BulmaField} from '@clebert/bulma-react/lib/bulma-field';
import {BulmaInput} from '@clebert/bulma-react/lib/bulma-input';
import {BulmaModalCard} from '@clebert/bulma-react/lib/bulma-modal-card';
import React from 'react';
import {useInputCallback} from '../../hooks/use-input-callback';

export interface EditDescriptionModalProps {
  readonly initialDescription: string;

  onUpdateDescription(description: string): void;
  onCancel(): void;
}

export function EditDescriptionModal({
  initialDescription,
  onUpdateDescription,
  onCancel,
}: EditDescriptionModalProps): JSX.Element {
  const [description, setDescription] = React.useState(initialDescription);

  const updateDescription = React.useCallback(
    (event: React.FormEvent) => {
      onUpdateDescription(description);
      event.preventDefault();
    },
    [onUpdateDescription, description]
  );

  return (
    <form onSubmit={updateDescription}>
      <BulmaModalCard
        title="Edit the description."
        footer={
          <BulmaField isGrouped>
            <BulmaButton type="submit" color="success">
              Update description
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

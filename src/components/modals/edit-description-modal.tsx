import {
  BulmaButton,
  BulmaField,
  BulmaInput,
  BulmaModalCard,
} from '@clebert/bulma-preact';
import {JSX, h} from 'preact';
import {useCallback, useState} from 'preact/hooks';
import {useInputCallback} from '../../hooks/use-input-callback';
import {preventDefault} from '../../utils/prevent-default';

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
  const [description, setDescription] = useState(initialDescription);

  const updateDescription = useCallback(
    preventDefault(() => onUpdateDescription(description)),
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

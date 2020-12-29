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

export interface CreateGistModalProps {
  onCreateGist(description: string): void;
  onCancel(): void;
}

export function CreateGistModal({
  onCreateGist,
  onCancel,
}: CreateGistModalProps): JSX.Element {
  const [description, setDescription] = useState('');

  const createGist = useCallback(
    preventDefault(() => onCreateGist(description)),
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

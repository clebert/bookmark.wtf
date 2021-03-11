import {Fragment, JSX, h} from 'preact';
import {useMemo, useState} from 'preact/hooks';
import {Button} from './button';
import {Form} from './form';
import {GridItem} from './grid-item';
import {Icon} from './icon';
import {TextField} from './text-field';

export interface NewCollectionFormProps {
  onCancel(): void;
  onCreate?(description: string): void;
}

export function NewCollectionForm({
  onCancel,
  onCreate,
}: NewCollectionFormProps): JSX.Element {
  const [currentDescription, setCurrentDescription] = useState('');

  const create = useMemo(() => {
    const description = currentDescription.trim();

    return onCreate && description ? () => onCreate(description) : undefined;
  }, [onCreate, currentDescription]);

  return (
    <Form onSubmit={create}>
      <GridItem
        class="NewCollectionForm"
        row1={
          <TextField
            class="DescriptionField"
            value={currentDescription}
            placeholder="Enter description"
            autoFocus
            required
            onInput={setCurrentDescription}
          />
        }
        row2={
          <>
            <Button
              class="CreateButton"
              type="submit"
              theme={'success'}
              disabled={!create}
            >
              <Icon type="check" />
              Create
            </Button>

            <Button class="CancelButton" onClick={onCancel}>
              <Icon type="x" />
              Cancel
            </Button>
          </>
        }
      />
    </Form>
  );
}

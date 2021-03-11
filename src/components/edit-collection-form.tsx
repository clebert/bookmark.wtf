import {Fragment, JSX, h} from 'preact';
import {useMemo, useState} from 'preact/hooks';
import {Button} from './button';
import {Form} from './form';
import {GridItem} from './grid-item';
import {Icon} from './icon';
import {TextField} from './text-field';

export interface EditCollectionFormProps {
  readonly initialDescription: string;

  onCancel(): void;
  onUpdate?(description: string): void;
}

export function EditCollectionForm({
  initialDescription,
  onCancel,
  onUpdate,
}: EditCollectionFormProps): JSX.Element {
  const [currentDescription, setCurrentDescription] = useState(
    initialDescription
  );

  const update = useMemo(() => {
    const description = currentDescription.trim();

    return onUpdate && description && description !== initialDescription
      ? () => onUpdate(description)
      : undefined;
  }, [onUpdate, currentDescription]);

  return (
    <Form onSubmit={update}>
      <GridItem
        class="EditCollectionForm"
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
              class="UpdateButton"
              type="submit"
              theme={'success'}
              disabled={!update}
            >
              <Icon type="check" />
              Update
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

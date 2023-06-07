import {Button} from './button.js';
import {Form} from './form.js';
import {GridItem} from './grid-item.js';
import {Icon} from './icon.js';
import {TextField} from './text-field.js';
import * as React from 'react';

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
  const [currentDescription, setCurrentDescription] =
    React.useState(initialDescription);

  const update = React.useMemo(() => {
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
              theme="success"
              title="Update collection"
              disabled={!update}
            >
              <Icon type="check" />
              Update
            </Button>

            <Button
              class="CancelButton"
              title="Cancel updating collection"
              onClick={onCancel}
            >
              <Icon type="x" />
              Cancel
            </Button>
          </>
        }
      />
    </Form>
  );
}

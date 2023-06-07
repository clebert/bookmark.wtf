import {Button} from './button.js';
import {Form} from './form.js';
import {GridItem} from './grid-item.js';
import {Icon} from './icon.js';
import {TextField} from './text-field.js';
import * as React from 'react';

export interface EditCollectionFormProps {
  initialDescription: string;

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
        className="EditCollectionForm"
        row1={
          <TextField
            className="DescriptionField"
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
              className="UpdateButton"
              type="submit"
              title="Update collection"
              disabled={!update}
              inverted
            >
              <Icon type="check" />
              Update
            </Button>

            <Button
              className="CancelButton"
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

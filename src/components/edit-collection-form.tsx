import {Form} from './form.js';
import {GridItem} from './grid-item.js';
import * as React from 'react';
import {Button, Icon, TextField} from 'wtfkit';

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
  const [currentDescription, setCurrentDescription] = React.useState(initialDescription);

  const update = React.useMemo(() => {
    const description = currentDescription.trim();

    return onUpdate && description && description !== initialDescription
      ? () => onUpdate(description)
      : undefined;
  }, [onUpdate, currentDescription]);

  const textFieldRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    textFieldRef.current?.focus();
  }, []);

  return (
    <Form onSubmit={update}>
      <GridItem
        className="EditCollectionForm"
        row1={
          <TextField
            ref={textFieldRef}
            className="DescriptionField"
            value={currentDescription}
            placeholder="Enter description"
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

            <Button className="CancelButton" title="Cancel updating collection" onClick={onCancel}>
              <Icon type="xMark" />
              Cancel
            </Button>
          </>
        }
      />
    </Form>
  );
}

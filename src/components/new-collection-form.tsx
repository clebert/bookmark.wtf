import {Button} from './button.js';
import {Form} from './form.js';
import {GridItem} from './grid-item.js';
import {Icon} from './icon.js';
import {TextField} from './text-field.js';
import * as React from 'react';

export interface NewCollectionFormProps {
  onCancel(): void;
  onCreate?(description: string): void;
}

export function NewCollectionForm({
  onCancel,
  onCreate,
}: NewCollectionFormProps): JSX.Element {
  const [currentDescription, setCurrentDescription] = React.useState(``);

  const create = React.useMemo(() => {
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
              theme="success"
              title="Create collection"
              disabled={!create}
            >
              <Icon type="check" />
              Create
            </Button>

            <Button
              class="CancelButton"
              title="Cancel creating collection"
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

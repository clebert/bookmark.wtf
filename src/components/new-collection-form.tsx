import {Form} from './form.js';
import {GridItem} from './grid-item.js';
import * as React from 'react';
import {Button, Icon, TextField} from 'wtfkit';

export interface NewCollectionFormProps {
  onCancel(): void;
  onCreate?(description: string): void;
}

export function NewCollectionForm({onCancel, onCreate}: NewCollectionFormProps): JSX.Element {
  const [currentDescription, setCurrentDescription] = React.useState(``);

  const create = React.useMemo(() => {
    const description = currentDescription.trim();

    return onCreate && description ? () => onCreate(description) : undefined;
  }, [onCreate, currentDescription]);

  const textFieldRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    textFieldRef.current?.focus();
  }, []);

  return (
    <Form onSubmit={create}>
      <GridItem
        className="NewCollectionForm"
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
              className="CreateButton"
              type="submit"
              title="Create collection"
              disabled={!create}
              inverted
            >
              <Icon type="check" />
              Create
            </Button>

            <Button className="CancelButton" title="Cancel creating collection" onClick={onCancel}>
              <Icon type="xMark" />
              Cancel
            </Button>
          </>
        }
      />
    </Form>
  );
}

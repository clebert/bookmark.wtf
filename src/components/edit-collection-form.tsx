import {Fragment, JSX, h} from 'preact';
import {useMemo, useState} from 'preact/hooks';
import {Theme} from '../utils/theme';
import {Button} from './button';
import {Form} from './form';
import {GridItem} from './grid-item';
import {Icon} from './icon';
import {Input} from './input';

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
        row1={
          <Input
            value={currentDescription}
            placeholder="Enter description"
            autoFocus
            required
            onInput={setCurrentDescription}
          />
        }
        row2={
          <>
            <Button onClick={onCancel}>
              <Icon type="x" />
              Cancel
            </Button>

            <Button type="submit" theme={Theme.success()} disabled={!update}>
              <Icon type="check" />
              Update
            </Button>
          </>
        }
        background
      />
    </Form>
  );
}

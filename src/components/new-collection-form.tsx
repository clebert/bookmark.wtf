import {Fragment, JSX, h} from 'preact';
import {useMemo, useState} from 'preact/hooks';
import {Theme} from '../utils/theme';
import {Button} from './button';
import {Form} from './form';
import {GridItem} from './grid-item';
import {Icon} from './icon';
import {Input} from './input';

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

            <Button type="submit" theme={Theme.success()} disabled={!create}>
              <Icon type="check" />
              Create
            </Button>
          </>
        }
      />
    </Form>
  );
}

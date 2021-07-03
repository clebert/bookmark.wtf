import {Fragment, JSX, h} from 'preact';
import {useMemo, useState} from 'preact/hooks';
import {Button} from './button';
import {Form} from './form';
import {GridItem} from './grid-item';
import {Icon} from './icon';
import {TextField} from './text-field';

export interface NewBookmarkFormProps {
  onCancel(): void;
  onCreate(title: string, url: string): void;
}

export function NewBookmarkForm({
  onCancel,
  onCreate,
}: NewBookmarkFormProps): JSX.Element {
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');

  const create = useMemo(() => {
    const title = currentTitle.trim();
    const url = currentUrl.trim();

    return title && url ? () => onCreate(title, url) : undefined;
  }, [onCreate, currentTitle, currentUrl]);

  return (
    <Form onSubmit={create}>
      <GridItem
        row1={
          <TextField
            value={currentTitle}
            placeholder="Enter title"
            autoFocus
            required
            onInput={setCurrentTitle}
          />
        }
        row2={
          <TextField
            type="url"
            value={currentUrl}
            placeholder="Enter URL"
            required
            onInput={setCurrentUrl}
          />
        }
        rightCol={
          <>
            <Button
              type="submit"
              theme="success"
              title="Create bookmark"
              disabled={!create}
            >
              <Icon type="check" />
              Create
            </Button>

            <Button title="Cancel creating bookmark" onClick={onCancel}>
              <Icon type="x" />
              Cancel
            </Button>
          </>
        }
      />
    </Form>
  );
}

import {Fragment, JSX, h} from 'preact';
import {useMemo, useState} from 'preact/hooks';
import {Button} from './button';
import {Form} from './form';
import {GridItem} from './grid-item';
import {Icon} from './icon';
import {TextField} from './text-field';

export interface NewBookmarkFormProps {
  onCancel(): void;
  onCreate?(title: string, url: string): void; // TODO: make required
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

    return onCreate && title && url ? () => onCreate(title, url) : undefined;
  }, [onCreate, currentTitle, currentUrl]);

  return (
    <Form onSubmit={create}>
      <GridItem
        row1={
          <TextField
            value={currentTitle}
            placeholder="Enter title"
            required
            onInput={setCurrentTitle}
          />
        }
        row2={
          <TextField
            type="url"
            value={currentUrl}
            placeholder="Enter URL"
            autoFocus
            required
            onInput={setCurrentUrl}
          />
        }
        rightCol={
          <>
            <Button type="submit" theme="success" disabled={!create}>
              <Icon type="check" />
              Create
            </Button>

            <Button onClick={onCancel}>
              <Icon type="x" />
              Cancel
            </Button>
          </>
        }
      />
    </Form>
  );
}

import {Fragment, JSX, h} from 'preact';
import {useMemo, useState} from 'preact/hooks';
import {Theme} from '../utils/theme';
import {Button} from './button';
import {Form} from './form';
import {GridItem} from './grid-item';
import {Icon} from './icon';
import {Input} from './input';

export interface NewBookmarkFormProps {
  onCancel(): void;
  onCreate?(title: string, url: string): void;
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
          <Input
            value={currentTitle}
            placeholder="Enter title"
            autoFocus
            required
            onInput={setCurrentTitle}
          />
        }
        row2={
          <Input
            type="url"
            value={currentUrl}
            placeholder="Enter URL"
            required
            onInput={setCurrentUrl}
          />
        }
        rightCol={
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

import {Fragment, JSX, h} from 'preact';
import {useMemo, useState} from 'preact/hooks';
import {Button} from './button';
import {Form} from './form';
import {GridItem} from './grid-item';
import {Icon} from './icon';
import {Input} from './input';

export interface NewBookmarkFormProps {
  readonly initialTitle: string;
  readonly initialUrl: string;

  onCancel(): void;
  onCreate?(title: string, url: string): void;
}

export function NewBookmarkForm({
  initialTitle,
  initialUrl,
  onCancel,
  onCreate,
}: NewBookmarkFormProps): JSX.Element {
  const [currentTitle, setCurrentTitle] = useState(initialTitle);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);

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
            <Button type="submit" theme={'success'} disabled={!create}>
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

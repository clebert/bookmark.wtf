import {JSX} from 'preact';
import {useMemo, useState} from 'preact/hooks';
import {Bookmark} from '../utils/parse-bookmark';
import {Button} from './button';
import {Form} from './form';
import {GetTitleButton} from './get-title-button';
import {GridItem} from './grid-item';
import {Icon} from './icon';
import {TextField} from './text-field';

export interface NewBookmarkFormProps {
  onCancel(): void;
  onCreate?(bookmark: Bookmark): void;
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

    return onCreate && title && url
      ? () => onCreate({title, url, ctime: Date.now()})
      : undefined;
  }, [onCreate, currentTitle, currentUrl]);

  return (
    <Form onSubmit={create}>
      <GridItem
        row1={
          <TextField
            type="url"
            value={currentUrl}
            placeholder="Enter URL"
            autoFocus
            required
            onInput={setCurrentUrl}
          />
        }
        row2={
          <TextField
            value={currentTitle}
            placeholder="Enter title"
            required
            onInput={setCurrentTitle}
          />
        }
        rightCol1={
          <GetTitleButton url={currentUrl} setTitle={setCurrentTitle} />
        }
        rightCol2={
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

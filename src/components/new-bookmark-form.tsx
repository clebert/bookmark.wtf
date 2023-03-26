import type {Bookmark} from '../utils/parse-bookmark.js';
import type {JSX} from 'preact';

import {Button} from './button.js';
import {Form} from './form.js';
import {GetTitleButton} from './get-title-button.js';
import {GridItem} from './grid-item.js';
import {Icon} from './icon.js';
import {TextField} from './text-field.js';
import {useSender} from '../hooks/use-sender.js';
import {useMemo, useState} from 'preact/hooks';

export interface NewBookmarkFormProps {
  onCancel(): void;
  onCreate?(bookmark: Bookmark): void;
}

export function NewBookmarkForm({
  onCancel,
  onCreate,
}: NewBookmarkFormProps): JSX.Element {
  const [currentTitle, setCurrentTitle] = useState(``);
  const [currentUrl, setCurrentUrl] = useState(``);

  const create = useMemo(() => {
    const title = currentTitle.trim();
    const url = currentUrl.trim();

    return onCreate && title && url
      ? () => onCreate({title, url, ctime: Date.now()})
      : undefined;
  }, [onCreate, currentTitle, currentUrl]);

  const getTitleSender = useSender();

  return (
    <Form onSubmit={create}>
      <GridItem
        row1={
          <TextField
            type="url"
            value={currentUrl}
            placeholder="Enter URL"
            autoFocus
            disabled={getTitleSender.state === `sending`}
            required
            onInput={setCurrentUrl}
          />
        }
        row2={
          <TextField
            value={currentTitle}
            placeholder="Enter title"
            disabled={getTitleSender.state === `sending`}
            required
            onInput={setCurrentTitle}
          />
        }
        rightCol1={
          <GetTitleButton
            sender={getTitleSender}
            url={currentUrl}
            setTitle={setCurrentTitle}
          />
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

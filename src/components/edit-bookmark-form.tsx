import type {JSX} from 'preact';
import {useMemo, useState} from 'preact/hooks';
import {useSender} from '../hooks/use-sender';
import {Button} from './button';
import {Form} from './form';
import {GetTitleButton} from './get-title-button';
import {GridItem} from './grid-item';
import {Icon} from './icon';
import {TextField} from './text-field';

export interface EditBookmarkFormProps {
  readonly initialTitle: string;
  readonly initialUrl: string;

  onCancel(): void;
  onUpdate?(title: string, url: string): void;
}

export function EditBookmarkForm({
  initialTitle,
  initialUrl,
  onCancel,
  onUpdate,
}: EditBookmarkFormProps): JSX.Element {
  const [currentTitle, setCurrentTitle] = useState(initialTitle);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);

  const update = useMemo(() => {
    const title = currentTitle.trim();
    const url = currentUrl.trim();

    return onUpdate &&
      title &&
      url &&
      (title !== initialTitle || url !== initialUrl)
      ? () => onUpdate(title, url)
      : undefined;
  }, [onUpdate, currentTitle, currentUrl]);

  const getTitleSender = useSender();

  return (
    <Form onSubmit={update}>
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
              title="Update bookmark"
              disabled={!update}
            >
              <Icon type="check" />
              Update
            </Button>

            <Button title="Cancel updating bookmark" onClick={onCancel}>
              <Icon type="x" />
              Cancel
            </Button>
          </>
        }
      />
    </Form>
  );
}

import {Fragment, JSX, h} from 'preact';
import {useMemo, useState} from 'preact/hooks';
import {Theme} from '../utils/theme';
import {Button} from './button';
import {Form} from './form';
import {GridItem} from './grid-item';
import {Icon} from './icon';
import {Input} from './input';

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

  return (
    <Form onSubmit={update}>
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
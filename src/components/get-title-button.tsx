import {Sender} from 'loxia';
import {JSX} from 'preact';
import {useMemo} from 'preact/hooks';
import {useBinder} from '../hooks/use-binder';
import {Button} from './button';
import {Icon} from './icon';

export interface GetTitleButtonProps {
  readonly sender: Sender;
  readonly url: string;

  setTitle(title: string): void;
}

export function GetTitleButton({
  sender,
  url,
  setTitle,
}: GetTitleButtonProps): JSX.Element {
  const bind = useBinder();

  const getTitle = useMemo(
    () =>
      url && sender.state === 'idle'
        ? () =>
            sender.send(
              fetch(`/api/get-title?url=${encodeURIComponent(url)}`)
                .then(
                  bind(async (response: Response) =>
                    response
                      .json()
                      .then(
                        bind((title) =>
                          setTitle(
                            typeof title === 'string' ? title : 'No title'
                          )
                        )
                      )
                  )
                )
                .catch(bind(() => setTitle('No title')))
            )
        : undefined,
    [sender, url]
  );

  return (
    <Button title="Get title" onClick={getTitle}>
      <Icon type="download" standalone />
    </Button>
  );
}

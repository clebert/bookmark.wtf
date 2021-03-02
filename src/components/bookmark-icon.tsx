import {JSX, h} from 'preact';
import {useCallback, useMemo} from 'preact/hooks';
import {useBinder} from '../hooks/use-binder';
import {createIdenticon} from '../utils/create-identicon';

export interface BookmarkIconProps {
  readonly linkUrl: string;

  onClick(): void;
}

export function BookmarkIcon({
  linkUrl,
  onClick,
}: BookmarkIconProps): JSX.Element {
  const bind = useBinder();

  const handleError = useCallback(
    (event: JSX.TargetedEvent<HTMLImageElement>) => {
      const {currentTarget} = event;

      createIdenticon(linkUrl)
        .then(bind((identicon) => currentTarget.setAttribute('src', identicon)))
        .catch(
          bind((error) => console.error('Failed to create identicon.', error))
        );
    },
    [linkUrl]
  );

  const imageUrl = useMemo(
    () =>
      `https://c.1password.com/richicons/images/login/120/${
        new URL(linkUrl).hostname
      }.png`,
    [linkUrl]
  );

  return (
    <a
      class="focus:outline-blue-400 select-none"
      href={linkUrl}
      tabIndex={-1}
      onClick={useCallback(
        (event: Event) => {
          event.preventDefault();
          onClick();
        },
        [onClick]
      )}
    >
      <img class="w-16 h-16" src={imageUrl} onError={handleError} />
    </a>
  );
}

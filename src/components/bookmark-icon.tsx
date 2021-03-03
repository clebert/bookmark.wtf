import {JSX, h} from 'preact';
import {useCallback, useMemo} from 'preact/hooks';
import {useBinder} from '../hooks/use-binder';
import {useDependentState} from '../hooks/use-dependent-state';
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
  const [imageUrlIndex, setImageUrlIndex] = useDependentState(0, [linkUrl]);

  const imageUrls = useMemo(() => {
    const {hostname, origin} = new URL(linkUrl);

    return [
      `https://c.1password.com/richicons/images/login/120/${hostname}.png`,
      `${origin}/apple-touch-icon.png`,
      `${origin}/favicon.ico`,
    ];
  }, [linkUrl]);

  const handleError = useCallback(
    (event: JSX.TargetedEvent<HTMLImageElement>) => {
      const {currentTarget} = event;

      if (imageUrlIndex < imageUrls.length - 1) {
        setImageUrlIndex(imageUrlIndex + 1);
      } else {
        createIdenticon(linkUrl)
          .then(
            bind((identicon) => currentTarget.setAttribute('src', identicon))
          )
          .catch(
            bind((error) => console.error('Failed to create identicon.', error))
          );
      }
    },
    [linkUrl, imageUrlIndex]
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
      <img
        class="w-16 h-16"
        src={imageUrls[imageUrlIndex]}
        onError={handleError}
      />
    </a>
  );
}

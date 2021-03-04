import {JSX, h} from 'preact';
import {useCallback, useMemo} from 'preact/hooks';
import {useBinder} from '../hooks/use-binder';
import {useDependentState} from '../hooks/use-dependent-state';
import {Colors} from '../utils/colors';
import {createIdenticon} from '../utils/create-identicon';
import {join} from '../utils/join';

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
      `${origin}/apple-touch-icon.png`,
      `https://c.1password.com/richicons/images/login/120/${hostname}.png`,
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
      class={join(['select-none', Colors.background(), Colors.focusOutline()])}
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

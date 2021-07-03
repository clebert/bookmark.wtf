import {JSX} from 'preact';
import {useCallback, useState} from 'preact/hooks';
import {useBinder} from '../hooks/use-binder';
import {Colors} from '../utils/colors';
import {createIdenticon} from '../utils/create-identicon';
import {join} from '../utils/join';

export interface BookmarkIconProps {
  readonly initialLinkUrl: string;

  onClick(): void;
}

export function BookmarkIcon({
  initialLinkUrl,
  onClick,
}: BookmarkIconProps): JSX.Element {
  const bind = useBinder();

  const [imageUrl, setImageUrl] = useState(
    () =>
      `https://c.1password.com/richicons/images/login/120/${
        new URL(initialLinkUrl).hostname
      }.png`
  );

  const handleError = useCallback(() => {
    if (imageUrl.includes('/richicons/images/login/120')) {
      setImageUrl(new URL(initialLinkUrl).origin + '/apple-touch-icon.png');
    } else if (imageUrl.includes('/apple-touch-icon.png')) {
      setImageUrl(new URL(initialLinkUrl).origin + '/favicon.ico');
    } else {
      createIdenticon(initialLinkUrl)
        .then(bind(setImageUrl))
        .catch(
          bind((error) => console.error('Failed to create identicon.', error))
        );
    }
  }, [imageUrl]);

  const [hidden, setHidden] = useState(true);
  const handleLoad = useCallback(() => setHidden(false), [setHidden]);

  return (
    <a
      class={join(['select-none', Colors.background(), Colors.focusOutline()])}
      href={initialLinkUrl}
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
        class={join(['w-16 h-16', hidden && 'opacity-0'])}
        src={imageUrl}
        onError={handleError}
        onLoad={handleLoad}
      />
    </a>
  );
}

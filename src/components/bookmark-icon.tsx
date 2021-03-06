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
  const {origin, hostname} = useMemo(() => new URL(linkUrl), [linkUrl]);

  const [imageUrl, setImageUrl] = useDependentState(
    () => `https://c.1password.com/richicons/images/login/120/${hostname}.png`,
    [hostname]
  );

  const handleError = useCallback(() => {
    if (imageUrl.includes('/richicons/images/login/120')) {
      setImageUrl(origin + '/apple-touch-icon.png');
    } else if (imageUrl.includes('/apple-touch-icon.png')) {
      setImageUrl(origin + '/favicon.ico');
    } else {
      createIdenticon(linkUrl)
        .then(bind(setImageUrl))
        .catch(
          bind((error) => console.error('Failed to create identicon.', error))
        );
    }
  }, [origin, imageUrl]);

  const [hidden, setHidden] = useDependentState(true, [linkUrl]);
  const handleLoad = useCallback(() => setHidden(false), [setHidden]);

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
        class={join(['w-16 h-16', hidden && 'opacity-0'])}
        src={imageUrl}
        onError={handleError}
        onLoad={handleLoad}
      />
    </a>
  );
}

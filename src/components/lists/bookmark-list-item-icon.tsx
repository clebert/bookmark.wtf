import {BulmaImage} from '@clebert/bulma-preact';
import {JSX, h} from 'preact';
import {useCallback, useMemo, useRef} from 'preact/hooks';
import {createIdenticon} from '../../utils/create-identicon';

export interface BookmarkListItemIconProps {
  readonly url: string;
  readonly onClick: JSX.MouseEventHandler<HTMLAnchorElement>;
}

export function BookmarkListItemIcon({
  url,
  onClick,
}: BookmarkListItemIconProps): JSX.Element {
  const iconUrlIndexRef = useRef(0);

  const iconUrls = useMemo(
    () => [
      createRichIconUrl(url),
      createIconUrl(url, 'apple-touch-icon.png'),
      createIconUrl(url, 'favicon.ico'),
    ],
    [url]
  );

  const handleError = useCallback(
    (event: JSX.TargetedEvent<HTMLImageElement>) => {
      const iconUrl = iconUrls[(iconUrlIndexRef.current += 1)];

      if (iconUrl) {
        event.currentTarget.setAttribute('src', iconUrl);
      } else {
        const {currentTarget} = event;

        createIdenticon(url)
          .then((identicon) => currentTarget?.setAttribute('src', identicon))
          .catch(console.error);
      }

      return () => (iconUrlIndexRef.current = 0);
    },
    [iconUrls]
  );

  return (
    <a href={url} onClick={onClick}>
      <BulmaImage
        dimension="64x64"
        src={useMemo(() => iconUrls[0], [iconUrls])}
        onError={handleError}
      />
    </a>
  );
}

function createRichIconUrl(url: string): string {
  return `https://c.1password.com/richicons/images/login/120/${
    new URL(url).hostname
  }.png`;
}

function createIconUrl(url: string, iconName: string): string {
  const urlObject = new URL(url);

  urlObject.pathname = iconName;

  return urlObject.toString();
}

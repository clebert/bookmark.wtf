import React from 'react';
import {BulmaImage} from '../../bulma/bulma-image';
import {createIdenticon} from '../../utils/create-identicon';

export interface BookmarkListItemIconProps {
  readonly url: string;
  readonly onClick: React.MouseEventHandler<HTMLAnchorElement>;
}

export function BookmarkListItemIcon({
  url,
  onClick,
}: BookmarkListItemIconProps): JSX.Element {
  const iconUrlIndexRef = React.useRef(0);

  const iconUrls = React.useMemo(
    () => [
      createRichIconUrl(url),
      createIconUrl(url, 'apple-touch-icon.png'),
      createIconUrl(url, 'favicon.ico'),
    ],
    [url]
  );

  const handleError = React.useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      const iconUrl = iconUrls[(iconUrlIndexRef.current += 1)];

      if (iconUrl) {
        event.currentTarget.setAttribute('src', iconUrl);
      } else {
        const {currentTarget} = event;

        createIdenticon(url, 256)
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
        src={React.useMemo(() => iconUrls[0], [iconUrls])}
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

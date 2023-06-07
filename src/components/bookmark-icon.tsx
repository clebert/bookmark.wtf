import {useBinder} from '../hooks/use-binder.js';
import {Colors} from '../utils/colors.js';
import {createIdenticon} from '../utils/create-identicon.js';
import {join} from '../utils/join.js';
import * as React from 'react';

export interface BookmarkIconProps {
  readonly initialLinkUrl: string;

  onClick(): void;
}

export function BookmarkIcon({
  initialLinkUrl,
  onClick,
}: BookmarkIconProps): JSX.Element {
  const bind = useBinder();

  const [imageUrl, setImageUrl] = React.useState(
    () =>
      `https://c.1password.com/richicons/images/login/120/${
        new URL(initialLinkUrl).hostname
      }.png`,
  );

  const handleError = React.useCallback(() => {
    if (imageUrl.includes(`/richicons/images/login/120`)) {
      setImageUrl(new URL(initialLinkUrl).origin + `/apple-touch-icon.png`);
    } else if (imageUrl.includes(`/apple-touch-icon.png`)) {
      setImageUrl(new URL(initialLinkUrl).origin + `/favicon.ico`);
    } else {
      createIdenticon(initialLinkUrl)
        .then(bind(setImageUrl))
        .catch(
          bind((error) => console.error(`Failed to create identicon.`, error)),
        );
    }
  }, [imageUrl]);

  const [hidden, setHidden] = React.useState(true);
  const handleLoad = React.useCallback(() => setHidden(false), [setHidden]);

  return (
    <a
      className={join([
        `select-none`,
        Colors.background(),
        Colors.focusOutline(),
      ])}
      href={initialLinkUrl}
      tabIndex={-1}
      onClick={React.useCallback(
        (event: React.MouseEvent<HTMLAnchorElement>) => {
          event.preventDefault();
          onClick();
        },
        [onClick],
      )}
    >
      <img
        className={join([`w-16 h-16`, hidden && `opacity-0`])}
        src={imageUrl}
        onError={handleError}
        onLoad={handleLoad}
      />
    </a>
  );
}

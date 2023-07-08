import {createIdenticon} from '../utils/create-identicon.js';
import * as React from 'react';
import {Styles, joinClassNames} from 'wtfkit';

export interface BookmarkIconProps {
  initialLinkUrl: string;

  onClick(): void;
}

export function BookmarkIcon({initialLinkUrl, onClick}: BookmarkIconProps): JSX.Element {
  const {hostname, origin} = new URL(initialLinkUrl);

  const [imageUrl, setImageUrl] = React.useState(
    () => `https://c.1password.com/richicons/images/login/120/${hostname}.png`,
  );

  const handleError = React.useCallback(() => {
    if (imageUrl.includes(`/richicons/images/login/120`)) {
      setImageUrl(origin + `/apple-touch-icon.png`);
    } else if (imageUrl.includes(`/apple-touch-icon.png`)) {
      setImageUrl(origin + `/favicon.ico`);
    } else {
      void createIdenticon(hostname).then(setImageUrl);
    }
  }, [imageUrl]);

  const [hidden, setHidden] = React.useState(true);
  const handleLoad = React.useCallback(() => setHidden(false), [setHidden]);
  const styles = React.useContext(Styles.Context);

  return (
    <a
      className={joinClassNames(`select-none`, styles.background(), styles.focus())}
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
        className={joinClassNames(`h-16 w-16`, hidden && `opacity-0`)}
        src={imageUrl}
        onError={handleError}
        onLoad={handleLoad}
      />
    </a>
  );
}

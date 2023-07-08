import * as React from 'react';
import {Styles, joinClassNames} from 'wtfkit';

export interface LinkProps extends React.PropsWithChildren {
  readonly url: string;
  readonly static?: boolean;

  onClick?(): void;
}

export function Link({children, url, static: isStatic, onClick}: LinkProps): JSX.Element {
  const styles = React.useContext(Styles.Context);

  return (
    <a
      className={joinClassNames(
        `overflow-hidden text-ellipsis whitespace-nowrap pr-1`,
        isStatic && `select-none`,
        styles.activeBackground(),
        styles.border({transparent: true}),
        styles.focus(),
        styles.link(),
      )}
      href={url}
      onClick={React.useMemo(
        () =>
          onClick
            ? (event: React.MouseEvent<HTMLAnchorElement>) => {
                event.preventDefault();
                onClick();
              }
            : undefined,
        [onClick],
      )}
    >
      {children}
    </a>
  );
}

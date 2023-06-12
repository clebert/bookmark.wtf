import {StylesContext} from '../contexts/styles-context.js';
import {joinClassNames} from '../utils/join-class-names.js';
import * as React from 'react';

export interface LinkProps extends React.PropsWithChildren {
  readonly url: string;
  readonly static?: boolean;

  onClick?(): void;
}

export function Link({children, url, static: isStatic, onClick}: LinkProps): JSX.Element {
  const styles = React.useContext(StylesContext);

  return (
    <a
      className={joinClassNames(
        `overflow-hidden text-ellipsis whitespace-nowrap pr-1`,
        isStatic && `select-none`,
        styles.background({interactive: `only`}),
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

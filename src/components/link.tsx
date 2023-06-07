import {Colors} from '../utils/colors.js';
import {joinClassNames} from '../utils/join-class-names.js';
import * as React from 'react';

export interface LinkProps extends React.PropsWithChildren {
  readonly url: string;
  readonly static?: boolean;

  onClick?(): void;
}

export function Link({
  children,
  url,
  static: isStatic,
  onClick,
}: LinkProps): JSX.Element {
  return (
    <a
      className={joinClassNames(
        `overflow-hidden text-ellipsis whitespace-nowrap pr-1`,
        Colors.text(`link`),
        Colors.activeText(`link`),
        Colors.focusOutline(),
        Colors.border(`hidden`),
        Colors.activeBackground(),
        isStatic && `select-none`,
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

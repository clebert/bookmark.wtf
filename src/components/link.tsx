import {Colors} from '../utils/colors.js';
import {join} from '../utils/join.js';
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
      className={join([
        Colors.text(`link`),
        Colors.activeText(`link`),
        Colors.focusOutline(),
        Colors.border(`hidden`),
        Colors.activeBackground(),
        `pr-1`,
        `overflow-hidden`,
        `text-ellipsis`,
        `whitespace-nowrap`,
        isStatic && `select-none`,
      ])}
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

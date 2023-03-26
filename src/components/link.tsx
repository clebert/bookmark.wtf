import type {ComponentChildren, JSX} from 'preact';

import {Colors} from '../utils/colors.js';
import {join} from '../utils/join.js';
import {useMemo} from 'preact/hooks';

export interface LinkProps {
  readonly children: ComponentChildren;
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
      href={url}
      onClick={useMemo(
        () =>
          onClick
            ? (event: Event) => {
                event.preventDefault();
                onClick();
              }
            : undefined,
        [onClick],
      )}
      class={join([
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
    >
      {children}
    </a>
  );
}

import {Colors} from '../utils/colors.js';
import {join} from '../utils/join.js';
import * as React from 'react';

export interface ButtonProps extends React.PropsWithChildren {
  readonly class?: string;
  readonly type?: 'button' | 'submit';
  readonly theme?: 'danger' | 'success';
  readonly title: string;
  readonly disabled?: boolean;

  onClick?(): void;
}

export function Button({
  children,
  class: className,
  type = `button`,
  theme,
  title,
  disabled,
  onClick,
}: ButtonProps): JSX.Element {
  const enabled = disabled === undefined ? onClick !== undefined : !disabled;

  return (
    <button
      className={join([
        className,
        `select-none whitespace-nowrap px-2`,
        Colors.text(theme),
        enabled && Colors.activeText(theme),
        enabled && Colors.focusOutline(),
        Colors.border(theme),
        Colors.background(),
        enabled && Colors.activeBackground(),
        !enabled && `opacity-25`,
        !enabled && `cursor-default`,
      ])}
      type={type}
      title={title}
      aria-label={title}
      disabled={!enabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

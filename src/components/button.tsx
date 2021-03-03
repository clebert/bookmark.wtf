import {ComponentChildren, JSX, h} from 'preact';
import {useCallback} from 'preact/hooks';
import {Colors} from '../utils/colors';
import {join} from '../utils/join';

export interface ButtonProps {
  readonly children: ComponentChildren;
  readonly type?: 'button' | 'submit';
  readonly theme?: 'danger' | 'success';
  readonly disabled?: boolean;

  onClick?(): void;
}

export function Button({
  children,
  type = 'button',
  theme,
  disabled,
  onClick,
}: ButtonProps): JSX.Element {
  return (
    <button
      type={type}
      onClick={useCallback(() => onClick?.(), [onClick])}
      disabled={disabled}
      class={join([
        Colors.text(theme),
        !disabled && Colors.activeText(theme),
        !disabled && Colors.focusOutline(),
        Colors.border(theme),
        Colors.background(),
        !disabled && Colors.activeBackground(),
        disabled && 'border-dashed',
        'px-2',
        'whitespace-nowrap',
        disabled && 'cursor-default',
        'select-none',
      ])}
    >
      {children}
    </button>
  );
}

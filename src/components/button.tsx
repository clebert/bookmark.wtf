import {ComponentChildren, JSX, h} from 'preact';
import {useCallback} from 'preact/hooks';
import {Colors} from '../utils/colors';
import {join} from '../utils/join';

export interface ButtonProps {
  readonly children: ComponentChildren;
  readonly id?: string;
  readonly type?: 'button' | 'submit';
  readonly theme?: 'danger' | 'success';
  readonly title?: string;
  readonly disabled?: boolean;

  onClick?(): void;
}

export function Button({
  children,
  id,
  type = 'button',
  theme,
  title,
  disabled,
  onClick,
}: ButtonProps): JSX.Element {
  return (
    <button
      id={id}
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
      type={type}
      title={title}
      disabled={disabled}
      onClick={useCallback(() => onClick?.(), [onClick])}
    >
      {children}
    </button>
  );
}

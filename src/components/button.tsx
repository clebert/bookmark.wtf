import {ComponentChildren, JSX, h} from 'preact';
import {useCallback} from 'preact/hooks';
import {join} from '../utils/join';
import {Theme} from '../utils/theme';

export interface ButtonProps {
  readonly children: ComponentChildren;
  readonly type?: 'button' | 'submit';
  readonly theme?: Theme;
  readonly disabled?: boolean;

  onClick?(): void;
}

export function Button({
  children,
  type = 'button',
  theme = Theme.default(),
  disabled,
  onClick,
}: ButtonProps): JSX.Element {
  return (
    <button
      type={type}
      onClick={useCallback(() => onClick?.(), [onClick])}
      disabled={disabled}
      class={join([
        theme.textColor,
        theme.borderColor,
        Theme.outlineColor,
        !disabled && Theme.activeTextColor,
        !disabled && Theme.activeBorderColor,
        !disabled && theme.hoverBorderColor,
        disabled && 'opacity-50',
        'bg-white',
        'border',
        'px-2',
        'text-left',
        'whitespace-nowrap',
        disabled && 'cursor-default',
        'select-none',
      ])}
    >
      {children}
    </button>
  );
}

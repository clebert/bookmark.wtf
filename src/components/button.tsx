import {ComponentChildren, JSX} from 'preact';
import {Colors} from '../utils/colors';
import {join} from '../utils/join';

export interface ButtonProps {
  readonly children: ComponentChildren;
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
  type = 'button',
  theme,
  title,
  disabled,
  onClick,
}: ButtonProps): JSX.Element {
  const enabled = disabled === undefined ? onClick !== undefined : !disabled;

  return (
    <button
      class={join([
        className,
        Colors.text(theme),
        enabled && Colors.activeText(theme),
        enabled && Colors.focusOutline(),
        Colors.border(theme),
        Colors.background(),
        enabled && Colors.activeBackground(),
        !enabled && 'border-dashed',
        'px-2',
        'whitespace-nowrap',
        !enabled && 'cursor-default',
        'select-none',
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

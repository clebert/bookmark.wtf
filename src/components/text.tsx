import {ComponentChildren, JSX, h} from 'preact';
import {join} from '../utils/join';
import {Theme} from '../utils/theme';

export interface TextProps {
  readonly children: ComponentChildren;
  readonly theme?: Theme;
  readonly bold?: boolean;
  readonly static?: boolean;
}

export function Text({
  children,
  theme = Theme.default(),
  bold,
  static: isStatic,
}: TextProps): JSX.Element {
  return (
    <span
      class={join([
        theme.textColor,
        Theme.outlineColor,
        bold ? Theme.boldFont : Theme.normalFont,
        'border',
        'border-transparent',
        'overflow-hidden',
        'overflow-ellipsis',
        'whitespace-nowrap',
        isStatic && 'cursor-default',
        isStatic && 'select-none',
      ])}
    >
      {children}
    </span>
  );
}

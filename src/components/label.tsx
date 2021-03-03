import {ComponentChildren, JSX, h} from 'preact';
import {join} from '../utils/join';
import {Theme} from '../utils/theme';

export interface TextProps {
  readonly children: ComponentChildren;
  readonly theme?: Theme;
  readonly bold?: boolean;
  readonly static?: boolean;
}

export function Label({
  children,
  theme = Theme.default(),
  bold,
  static: isStatic,
}: TextProps): JSX.Element {
  return (
    <label
      class={join([
        theme.textColor,
        bold && 'font-bold',
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
    </label>
  );
}

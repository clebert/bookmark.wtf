import {ComponentChildren, JSX} from 'preact';
import {Colors} from '../utils/colors';
import {join} from '../utils/join';

export interface TextProps {
  readonly children: ComponentChildren;
  readonly bold?: boolean;
  readonly static?: boolean;
}

export function Label({
  children,
  bold,
  static: isStatic,
}: TextProps): JSX.Element {
  return (
    <label
      class={join([
        Colors.text(),
        Colors.border('hidden'),
        bold && 'font-bold',
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

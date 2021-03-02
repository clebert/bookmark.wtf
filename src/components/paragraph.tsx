import {ComponentChildren, JSX, h} from 'preact';
import {join} from '../utils/join';
import {Theme} from '../utils/theme';

export interface ParagraphProps {
  readonly children: ComponentChildren;
  readonly theme?: Theme;
}

export function Paragraph({
  children,
  theme = Theme.default(),
}: ParagraphProps): JSX.Element {
  return (
    <p
      class={join([
        theme.textColor,
        Theme.normalFont,
        'border',
        'border-transparent',
        'cursor-default',
        'select-none',
      ])}
    >
      {children}
    </p>
  );
}

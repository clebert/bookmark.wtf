import type {ComponentChildren, JSX} from 'preact';
import {Colors} from '../utils/colors';
import {join} from '../utils/join';

export interface ParagraphProps {
  readonly children: ComponentChildren;
  readonly theme?: 'danger';
}

export function Paragraph({children, theme}: ParagraphProps): JSX.Element {
  return (
    <p
      class={join([
        Colors.text(theme),
        Colors.border(`hidden`),
        `cursor-default`,
        `select-none`,
      ])}
    >
      {children}
    </p>
  );
}

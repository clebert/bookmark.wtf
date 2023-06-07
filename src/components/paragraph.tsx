import {Colors} from '../utils/colors.js';
import {join} from '../utils/join.js';
import * as React from 'react';

export interface ParagraphProps extends React.PropsWithChildren {
  readonly theme?: 'danger';
}

export function Paragraph({children, theme}: ParagraphProps): JSX.Element {
  return (
    <div
      className={join([
        Colors.text(theme),
        Colors.border(`hidden`),
        `cursor-default`,
        `select-none`,
      ])}
    >
      {children}
    </div>
  );
}

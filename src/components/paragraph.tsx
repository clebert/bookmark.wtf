import {Colors} from '../utils/colors.js';
import {joinClassNames} from '../utils/join-class-names.js';
import * as React from 'react';

export interface ParagraphProps extends React.PropsWithChildren {
  readonly theme?: 'danger';
}

export function Paragraph({children, theme}: ParagraphProps): JSX.Element {
  return (
    <div
      className={joinClassNames(
        `cursor-default select-none`,
        Colors.text(theme),
        Colors.border(`hidden`),
      )}
    >
      {children}
    </div>
  );
}

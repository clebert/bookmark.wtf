import {Label} from './label.js';
import {Colors} from '../utils/colors.js';
import {joinClassNames} from '../utils/join-class-names.js';
import * as React from 'react';

export interface GridItemProps {
  readonly class?: string;
  readonly leftCol?: React.ReactNode;
  readonly row1: React.ReactNode;
  readonly row2?: React.ReactNode;
  readonly rightCol?: React.ReactNode;
}

export function GridItem({
  class: className,
  leftCol,
  row1,
  row2,
  rightCol,
}: GridItemProps): JSX.Element {
  return (
    <div
      className={joinClassNames(
        className,
        `flex space-x-2 p-2 shadow`,
        Colors.shadedBackground(),
      )}
    >
      {leftCol && <div className="flex shrink-0 items-center">{leftCol}</div>}

      <div className="flex w-full flex-col space-y-4 overflow-hidden">
        <div className="flex w-full space-x-2">{row1}</div>

        <div className="flex w-full space-x-2">
          {row2 || <Label static>{`\u00A0`}</Label>}
        </div>
      </div>

      {rightCol && (
        <div className="flex shrink-0 flex-col space-y-4">{rightCol}</div>
      )}
    </div>
  );
}

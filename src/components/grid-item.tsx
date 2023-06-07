import {Label} from './label.js';
import {Colors} from '../utils/colors.js';
import {join} from '../utils/join.js';
import * as React from 'react';

export interface GridItemProps {
  readonly class?: string;
  readonly leftCol?: React.ReactNode;
  readonly row1: React.ReactNode;
  readonly row2?: React.ReactNode;
  readonly rightCol1?: React.ReactNode;
  readonly rightCol2?: React.ReactNode;
  readonly highlight?: boolean;
}

export function GridItem({
  class: className,
  leftCol,
  row1,
  row2,
  rightCol1,
  rightCol2,
  highlight,
}: GridItemProps): JSX.Element {
  return (
    <div
      className={join([
        className,
        `flex space-x-2 p-2 shadow`,
        Colors.shadedBackground(),
        highlight && Colors.highlightRing(),
      ])}
    >
      {leftCol && <div className="flex shrink-0 items-center">{leftCol}</div>}

      <div className="flex flex-col space-y-4 w-full overflow-hidden">
        <div className="flex space-x-2 w-full">{row1}</div>

        <div className="flex space-x-2 w-full">
          {row2 || <Label static>{`\u00A0`}</Label>}
        </div>
      </div>

      {rightCol1 && (
        <div className="flex flex-col shrink-0 space-y-4">{rightCol1}</div>
      )}

      {rightCol2 && (
        <div className="flex flex-col shrink-0 space-y-4">{rightCol2}</div>
      )}
    </div>
  );
}

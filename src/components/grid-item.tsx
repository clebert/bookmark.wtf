import {Label} from './label.js';
import {StylesContext} from '../contexts/styles-context.js';
import {joinClassNames} from '../utils/join-class-names.js';
import * as React from 'react';

export interface GridItemProps {
  className?: string;
  leftCol?: React.ReactNode;
  row1: React.ReactNode;
  row2?: React.ReactNode;
  rightCol?: React.ReactNode;
}

export function GridItem({
  className,
  leftCol,
  row1,
  row2,
  rightCol,
}: GridItemProps): JSX.Element {
  const styles = React.useContext(StylesContext);

  return (
    <div
      className={joinClassNames(
        className,
        `flex space-x-2 p-2 shadow`,
        styles.background({shaded: true}),
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

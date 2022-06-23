import type {ComponentChildren, JSX} from 'preact';
import {Colors} from '../utils/colors.js';
import {join} from '../utils/join.js';
import {Label} from './label.js';

export interface GridItemProps {
  readonly class?: string;
  readonly leftCol?: ComponentChildren;
  readonly row1: ComponentChildren;
  readonly row2?: ComponentChildren;
  readonly rightCol1?: ComponentChildren;
  readonly rightCol2?: ComponentChildren;
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
      class={join([
        className,
        `flex space-x-2 p-2 shadow`,
        Colors.shadedBackground(),
        highlight && Colors.highlightRing(),
      ])}
    >
      {leftCol && <div class="flex shrink-0 items-center">{leftCol}</div>}

      <div class="flex flex-col space-y-4 w-full overflow-hidden">
        <div class="flex space-x-2 w-full">{row1}</div>

        <div class="flex space-x-2 w-full">
          {row2 || <Label static>{`\u00A0`}</Label>}
        </div>
      </div>

      {rightCol1 && (
        <div class="flex flex-col shrink-0 space-y-4">{rightCol1}</div>
      )}

      {rightCol2 && (
        <div class="flex flex-col shrink-0 space-y-4">{rightCol2}</div>
      )}
    </div>
  );
}

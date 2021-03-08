import {ComponentChildren, JSX, h} from 'preact';
import {Colors} from '../utils/colors';
import {join} from '../utils/join';
import {Label} from './label';

export interface GridItemProps {
  readonly class?: string;
  readonly leftCol?: ComponentChildren;
  readonly row1: ComponentChildren;
  readonly row2?: ComponentChildren;
  readonly rightCol?: ComponentChildren;
  readonly highlight?: boolean;
}

export function GridItem({
  class: className,
  leftCol,
  row1,
  row2,
  rightCol,
  highlight,
}: GridItemProps): JSX.Element {
  return (
    <div
      class={join([
        className,
        'flex space-x-4 p-2 shadow',
        Colors.shadedBackground(),
        highlight && Colors.highlightRing(),
      ])}
    >
      {leftCol && <div class="flex flex-shrink-0 items-center">{leftCol}</div>}

      <div class="flex flex-col space-y-4 w-full overflow-hidden">
        <div class="flex space-x-4 w-full">{row1}</div>

        <div class="flex space-x-4 w-full">
          {row2 || <Label static>{'\u00A0'}</Label>}
        </div>
      </div>

      {rightCol && (
        <div class="flex flex-col flex-shrink-0 space-y-4">{rightCol}</div>
      )}
    </div>
  );
}

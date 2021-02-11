import {ComponentChildren, JSX, h} from 'preact';
import {join} from '../utils/join';

export interface GridItemProps {
  readonly leftCol?: ComponentChildren;
  readonly row1: ComponentChildren;
  readonly row2?: ComponentChildren;
  readonly rightCol?: ComponentChildren;
  readonly background?: boolean;
  readonly highlight?: boolean;
}

export function GridItem({
  leftCol,
  row1,
  row2,
  rightCol,
  background,
  highlight,
}: GridItemProps): JSX.Element {
  return (
    <div
      class={join([
        'flex space-x-4 p-2',
        background &&
          (highlight
            ? 'bg-gradient-to-r from-gray-200 to-gray-300 shadow'
            : 'bg-gradient-to-r from-gray-50 to-gray-100 shadow'),
      ])}
    >
      {leftCol && <div class="flex flex-shrink-0 items-center">{leftCol}</div>}

      <div class="flex flex-col space-y-4 w-full overflow-hidden">
        <div class="flex space-x-4 w-full">{row1}</div>
        {row2 && <div class="flex space-x-4 w-full">{row2}</div>}
      </div>

      {rightCol && (
        <div class="flex flex-col flex-shrink-0 space-y-4">{rightCol}</div>
      )}
    </div>
  );
}

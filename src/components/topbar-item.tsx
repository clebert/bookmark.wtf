import {ComponentChildren, JSX, h} from 'preact';

export interface GridItemProps {
  readonly children: ComponentChildren;
}

export function TopbarItem({children}: GridItemProps): JSX.Element {
  return <div class="flex md:items-center space-x-4">{children}</div>;
}

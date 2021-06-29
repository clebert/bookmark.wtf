import {ComponentChildren, JSX, h} from 'preact';

export interface GridItemProps {
  readonly children: ComponentChildren;
}

export function TopbarItem({children}: GridItemProps): JSX.Element {
  return <div class="flex items-center space-x-2">{children}</div>;
}

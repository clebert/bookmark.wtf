import {ComponentChildren, JSX, h} from 'preact';

export interface PageProps {
  readonly children: ComponentChildren;
}

export function Page({children}: PageProps): JSX.Element {
  return <div class="flex flex-col m-4 space-y-4">{children}</div>;
}

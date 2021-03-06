import {ComponentChildren, JSX, h} from 'preact';
import {join} from '../utils/join';

export interface GridProps {
  readonly children: ComponentChildren;
}

export function Grid({children}: GridProps): JSX.Element {
  return (
    <div
      class={join([
        'grid',
        'grid-cols-1',
        'md:grid-cols-2',
        'lg:grid-cols-3',
        'xl:grid-cols-4',
        '2xl:grid-cols-5',
        'gap-4',
      ])}
    >
      {children}
    </div>
  );
}

import classnames from 'classnames';
import React from 'react';

export interface BulmaHeroProps {
  readonly children: React.ReactNode;
  readonly color?: BulmaHeroColor;
  readonly size?: BulmaHeroSize;
  readonly isBold?: boolean;
}

export type BulmaHeroColor =
  | 'primary'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'light'
  | 'dark';

export type BulmaHeroSize = 'medium' | 'large' | 'fullHeight';

/**
 * https://bulma.io/documentation/layout/hero/
 */
export function BulmaHero(props: BulmaHeroProps): JSX.Element {
  return (
    <section
      className={classnames({
        'hero': true,
        [`is-${props.color ?? 'color'}`]: props.color,
        [`is-${
          props.size?.replace('fullHeight', 'fullheight') ?? 'size'
        }`]: props.size,
        'is-bold': props.isBold,
      })}
    >
      <div className="hero-body">{props.children}</div>
    </section>
  );
}

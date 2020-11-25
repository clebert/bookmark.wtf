import classnames from 'classnames';
import React from 'react';

export interface BulmaTagsProps {
  readonly children: React.ReactNode;
  readonly hasAddons?: boolean;
}

/**
 * https://bulma.io/documentation/elements/tag/
 */
export function BulmaTags(props: BulmaTagsProps): JSX.Element {
  return (
    <div className="control">
      <div
        className={classnames({'tags': true, 'has-addons': props.hasAddons})}
      >
        {props.children}
      </div>
    </div>
  );
}

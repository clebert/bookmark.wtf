import React from 'react';

export interface BulmaMediaObjectProps {
  readonly children: React.ReactNode;
  readonly left?: React.ReactNode;
  readonly right?: React.ReactNode;
}

/**
 * https://bulma.io/documentation/layout/media-object/
 */
export function BulmaMediaObject(props: BulmaMediaObjectProps): JSX.Element {
  return (
    <article className="media">
      {props.left && <div className="media-left">{props.left}</div>}

      <div className="media-content" style={{overflowX: 'initial'}}>
        {props.children}
      </div>

      {props.right && <div className="media-right">{props.right}</div>}
    </article>
  );
}

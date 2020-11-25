import classnames from 'classnames';
import React from 'react';

export interface BulmaLevelProps {
  readonly items?: React.ReactNode[];
  readonly rightItems?: React.ReactNode[];
  readonly isMobile?: boolean;
}

/**
 * https://bulma.io/documentation/layout/level/
 */
export function BulmaLevel(props: BulmaLevelProps): JSX.Element {
  return (
    <nav className={classnames({'level': true, 'is-mobile': props.isMobile})}>
      {props.items && (
        <div className="level-left">
          {props.items.map((item, index) => (
            <div key={index} className="level-item">
              {item}
            </div>
          ))}
        </div>
      )}

      {props.rightItems && (
        <div className="level-right">
          {props.rightItems.map((item, index) => (
            <div key={index} className="level-item">
              {item}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}

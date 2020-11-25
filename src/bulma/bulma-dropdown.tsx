import classnames from 'classnames';
import React from 'react';

export interface BulmaDropdownProps {
  readonly children: React.ReactNode;
  readonly triggerButton: React.ReactNode;
  readonly isActive?: boolean;
  readonly isHoverable?: boolean;
  readonly isRight?: boolean;
  readonly isUp?: boolean;
}

/**
 * https://bulma.io/documentation/components/dropdown/
 */
export function BulmaDropdown(props: BulmaDropdownProps): JSX.Element {
  return (
    <div className="control">
      <div
        className={classnames({
          'dropdown': true,
          'is-active': props.isActive,
          'is-hoverable': props.isHoverable,
          'is-right': props.isRight,
          'is-up': props.isUp,
        })}
      >
        <div className="dropdown-trigger">{props.triggerButton}</div>

        <div className="dropdown-menu">
          <div className="dropdown-content">{props.children}</div>
        </div>
      </div>
    </div>
  );
}

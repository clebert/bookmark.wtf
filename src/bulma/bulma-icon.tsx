import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import React from 'react';

export interface BulmaIconProps {
  readonly children?: React.ReactNode;
  readonly definition: IconDefinition;
  readonly size?: BulmaIconSize;
  readonly isRightAligned?: boolean;
}

export type BulmaIconSize = 'small' | 'medium' | 'large';

/**
 * https://bulma.io/documentation/elements/icon/
 */
export function BulmaIcon(props: BulmaIconProps): JSX.Element {
  return (
    <>
      {props.isRightAligned && props.children && <span>{props.children}</span>}

      <span
        className={classnames({
          icon: true,
          [`is-${props.size ?? 'size'}`]: props.size,
        })}
      >
        <FontAwesomeIcon icon={props.definition} />
      </span>

      {!props.isRightAligned && props.children && <span>{props.children}</span>}
    </>
  );
}

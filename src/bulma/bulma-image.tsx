import classnames from 'classnames';
import React from 'react';

export interface BulmaImageProps {
  readonly dimension?: BulmaImageDimension;
  readonly ratio?: BulmaImageRatio;
  readonly src?: string;
  readonly isRounded?: boolean;
  readonly onError?: React.ReactEventHandler<HTMLImageElement>;
}

export type BulmaImageDimension =
  | '16x16'
  | '24x24'
  | '32x32'
  | '48x48'
  | '64x64'
  | '96x96'
  | '128x128';

export type BulmaImageRatio =
  | 'square'
  | '1by1'
  | '5by4'
  | '4by3'
  | '3by2'
  | '5by3'
  | '16by9'
  | '2by1'
  | '3by1'
  | '4by5'
  | '3by4'
  | '2by3'
  | '3by5'
  | '9by16'
  | '1by2'
  | '1by3';

/**
 * https://bulma.io/documentation/elements/image/
 */
export function BulmaImage(props: BulmaImageProps): JSX.Element {
  return (
    <figure
      className={classnames({
        image: true,
        [`is-${props.dimension ?? 'dimension'}`]: props.dimension,
        [`is-${props.ratio ?? 'ratio'}`]: props.ratio,
      })}
    >
      {props.src && (
        <img
          className={classnames({'is-rounded': props.isRounded})}
          src={props.src}
          onError={props.onError}
        />
      )}
    </figure>
  );
}

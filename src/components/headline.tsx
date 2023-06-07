import {Colors} from '../utils/colors.js';
import {join} from '../utils/join.js';
import * as React from 'react';

export function Headline(): JSX.Element {
  return (
    <h1
      className={join([
        `text-3xl`,
        `font-bold`,
        `whitespace-nowrap`,
        `cursor-default`,
        `select-none`,
      ])}
    >
      <span className={Colors.text()}>bookmark.</span>
      <span className={Colors.text(`danger`)}>w</span>
      <span className={Colors.text(`success`)}>t</span>
      <span className={Colors.text(`link`)}>f</span>
    </h1>
  );
}

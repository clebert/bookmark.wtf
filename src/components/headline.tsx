import {Colors} from '../utils/colors.js';
import * as React from 'react';

export function Headline(): JSX.Element {
  return (
    <h1 className="cursor-default select-none whitespace-nowrap text-3xl font-bold">
      <span className={Colors.text()}>bookmark.</span>
      <span className={Colors.text(`danger`)}>w</span>
      <span className={Colors.text(`success`)}>t</span>
      <span className={Colors.text(`link`)}>f</span>
    </h1>
  );
}

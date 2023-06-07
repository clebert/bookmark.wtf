import {Colors} from '../utils/colors.js';
import * as React from 'react';

export function Logo(): JSX.Element {
  return (
    <div className="flex items-center justify-center border w-48 h-48">
      <h1 className="text-8xl font-bold">
        <span className={Colors.text()}>.</span>
        <span className={Colors.text(`danger`)}>w</span>
        <span className={Colors.text(`success`)}>t</span>
        <span className={Colors.text(`link`)}>f</span>
      </h1>
    </div>
  );
}

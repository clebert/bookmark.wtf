import type {JSX} from 'preact';
import {Colors} from '../utils/colors';
import {join} from '../utils/join';

export function Headline(): JSX.Element {
  return (
    <h1
      class={join([
        `text-3xl`,
        `font-bold`,
        `whitespace-nowrap`,
        `cursor-default`,
        `select-none`,
      ])}
    >
      <span class={Colors.text()}>bookmark.</span>
      <span class={Colors.text(`danger`)}>w</span>
      <span class={Colors.text(`success`)}>t</span>
      <span class={Colors.text(`link`)}>f</span>
    </h1>
  );
}

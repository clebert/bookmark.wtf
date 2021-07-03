import {JSX} from 'preact';
import {Colors} from '../utils/colors';

export function Logo(): JSX.Element {
  return (
    <div class="flex items-center justify-center border w-48 h-48">
      <h1 class="text-8xl font-bold">
        <span class={Colors.text()}>.</span>
        <span class={Colors.text('danger')}>w</span>
        <span class={Colors.text('success')}>t</span>
        <span class={Colors.text('link')}>f</span>
      </h1>
    </div>
  );
}

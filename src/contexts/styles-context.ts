import {joinClassNames} from '../utils/join-class-names.js';
import * as React from 'react';

export interface Styles {
  background(
    options?:
      | {readonly interactive?: 'only' | boolean; readonly inverted?: boolean}
      | {readonly shaded: boolean},
  ): string;

  border(options?: {readonly transparent?: boolean}): string;
  focus(options?: {readonly within?: boolean}): string;
  link(): string;

  text(options?: {
    readonly interactive?: boolean;
    readonly inverted?: boolean;
    readonly placeholder?: boolean;
  }): string;
}

export const StylesContext = React.createContext<Styles>({
  background(options = {}) {
    if (`shaded` in options) {
      return options.shaded
        ? `bg-gray-100 dark:bg-gray-800`
        : `bg-white dark:bg-gray-900`;
    }

    const {interactive, inverted} = options;

    return joinClassNames(
      interactive &&
        (inverted
          ? `active:bg-white dark:active:bg-gray-900`
          : `active:bg-gray-900 dark:active:bg-white`),
      interactive !== `only` &&
        (inverted ? `bg-gray-900 dark:bg-white` : `bg-white dark:bg-gray-900`),
    );
  },

  border({transparent} = {}) {
    return transparent
      ? `border border-transparent`
      : `border border-gray-300 dark:border-gray-700`;
  },

  focus({within} = {}) {
    return within
      ? `focus-within:outline focus-within:outline-1 focus-within:outline-offset-[-1px] focus-within:outline-blue-400`
      : `focus:outline focus:outline-1 focus:outline-offset-[-1px] focus:outline-blue-400`;
  },

  link() {
    return `text-blue-800 dark:text-blue-200 active:text-blue-200 dark:active:text-blue-800`;
  },

  text({interactive, inverted, placeholder} = {}) {
    return joinClassNames(
      interactive &&
        (inverted
          ? `active:text-black dark:active:text-white`
          : `active:text-white dark:active:text-black`),
      inverted ? `text-white dark:text-black` : `text-black dark:text-white`,
      placeholder && `placeholder-gray-400`,
    );
  },
});

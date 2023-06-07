import {joinClassNames} from './join-class-names.js';

export type TextTheme = 'link' | 'danger' | 'success';
export type BorderTheme = 'danger' | 'success' | 'hidden';

export class Colors {
  static text(theme?: TextTheme): string {
    return joinClassNames(
      !theme && `text-black dark:text-white`,
      theme === `link` && `text-blue-800 dark:text-blue-200`,
      theme === `danger` && `text-red-800 dark:text-red-200`,
      theme === `success` && `text-emerald-800 dark:text-emerald-200`,
    );
  }

  static activeText(theme?: TextTheme): string {
    return joinClassNames(
      !theme && `active:text-white dark:active:text-black`,
      theme === `link` && `active:text-blue-200 dark:active:text-blue-800`,
      theme === `danger` && `active:text-red-200 dark:active:text-red-800`,
      theme === `success` &&
        `active:text-emerald-200 dark:active:text-emerald-800`,
    );
  }

  static placeholderText(): string {
    return `placeholder-gray-400`;
  }

  static border(theme?: BorderTheme): string {
    return joinClassNames(
      !theme && `border border-gray-300 dark:border-gray-700`,
      theme === `danger` && `border border-red-300 dark:border-red-700`,
      theme === `success` &&
        `border border-emerald-300 dark:border-emerald-700`,
      theme === `hidden` && `border border-transparent`,
    );
  }

  static focusOutline(): string {
    return `focus:outline-blue-400 focus:outline-1 focus:outline focus:outline-offset-[-1px]`;
  }

  static background(): string {
    return `bg-white dark:bg-gray-900`;
  }

  static activeBackground(): string {
    return `active:bg-gray-900 dark:active:bg-white`;
  }

  static shadedBackground(): string {
    return `bg-gray-100 dark:bg-gray-800`;
  }
}

import {join} from './join';

export class Colors {
  static text(theme?: 'danger' | 'link' | 'success'): string {
    return join([
      !theme && 'text-black dark:text-white',
      theme === 'danger' && 'text-red-800 dark:text-red-200',
      theme === 'link' && 'text-blue-800 dark:text-blue-200',
      theme === 'success' && 'text-green-800 dark:text-green-200',
    ]);
  }

  static activeText(theme?: 'danger' | 'link' | 'success'): string {
    return join([
      !theme && 'active:text-white dark:active:text-black',
      theme === 'danger' && 'active:text-red-200 dark:active:text-red-800',
      theme === 'link' && 'active:text-blue-200 dark:active:text-blue-800',
      theme === 'success' && 'active:text-green-200 dark:active:text-green-800',
    ]);
  }

  static placeholderText(): string {
    return 'placeholder-gray-400';
  }

  static border(theme?: 'danger' | 'success' | 'hidden'): string {
    return join([
      !theme && 'border border-gray-300 dark:border-gray-700',
      theme === 'danger' && 'border border-red-300 dark:border-red-700',
      theme === 'success' && 'border border-green-300 dark:border-green-700',
      theme === 'hidden' && 'border border-transparent',
    ]);
  }

  static focusOutline(): string {
    return 'focus:outline-blue-400';
  }

  static highlightRing(): string {
    return 'ring-inset ring-1 ring-yellow-400';
  }

  static background(): string {
    return 'bg-white dark:bg-gray-900';
  }

  static activeBackground(): string {
    return 'active:bg-gray-900 dark:active:bg-white';
  }

  static shadedBackground(): string {
    return 'bg-gray-100 dark:bg-gray-800';
  }
}

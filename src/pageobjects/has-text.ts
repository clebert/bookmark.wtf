import {PseudoClass} from './parent';

export function hasText(text: string): PseudoClass {
  return (selector) => `${selector}:has-text("${text}")`;
}

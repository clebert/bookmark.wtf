import {Discriminator, pseudoClass} from 'sonnar';

/**
 * https://playwright.dev/docs/selectors#text-selector
 */
export function hasText(value: string): Discriminator {
  return pseudoClass(`:has-text(${JSON.stringify(value)})`);
}

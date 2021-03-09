import {Discriminator, pseudoClass} from 'sonnar';

export function hasText(value: string): Discriminator {
  return pseudoClass(`:has-text(${JSON.stringify(value)})`);
}

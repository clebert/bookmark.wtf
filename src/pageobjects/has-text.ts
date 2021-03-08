import {pseudoClass} from './pseudo-class';
import {Discriminator} from './query';

export function hasText(value: string): Discriminator {
  return pseudoClass(`:has-text(${JSON.stringify(value)})`);
}

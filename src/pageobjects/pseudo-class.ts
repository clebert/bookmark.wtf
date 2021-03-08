import {Discriminator} from './query';

export function pseudoClass(value: string): Discriminator {
  return (selector) => selector + (value.startsWith(':') ? value : ':' + value);
}

import {Primitive, fn, select} from 'sonnar';

export function containsText(text: string): Primitive {
  return fn('contains', select('descendant-or-self').text(), text);
}

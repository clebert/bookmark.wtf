import {NodeSet, Primitive, fn} from 'sonnar';

export function containsText(text: string): Primitive {
  return fn('contains', fn('normalize-space', NodeSet.self()), text);
}

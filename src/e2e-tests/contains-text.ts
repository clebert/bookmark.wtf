import type {Primitive} from 'sonnar';
import {NodeSet, fn} from 'sonnar';

export function containsText(text: string): Primitive {
  return fn(`contains`, fn(`normalize-space`, NodeSet.self()), text);
}

import {isString} from './is-string.js';

export function isNonEmptyString(value: unknown): value is string {
  return isString(value) && value.length > 0;
}

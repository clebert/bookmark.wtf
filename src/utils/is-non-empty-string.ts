import {isString} from './is-string';

export function isNonEmptyString(value: unknown): value is string {
  return isString(value) && value.length > 0;
}

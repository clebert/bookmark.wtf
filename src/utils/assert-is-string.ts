import {isString} from './is-string';

export function assertIsString(
  value: unknown,
  valueName: string,
): asserts value is string {
  if (!isString(value)) {
    throw new Error(`The value of "${valueName}" must be of type string.`);
  }
}

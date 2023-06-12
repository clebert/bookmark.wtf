export function assertIsString(value: unknown, valueName: string): asserts value is string {
  if (typeof value !== `string`) {
    throw new Error(`The value of "${valueName}" must be of type string.`);
  }
}

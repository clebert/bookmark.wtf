export function ensureIsString(
  defaultValue: string = ''
): (value: unknown) => string {
  return (value) => (typeof value === 'string' ? value : defaultValue);
}

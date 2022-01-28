export function ensure<TValue>(
  predicate: (value: unknown) => value is TValue,
  defaultValue: TValue,
): (value: unknown) => TValue {
  return (value) => (predicate(value) ? value : defaultValue);
}

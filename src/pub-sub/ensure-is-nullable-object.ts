export function ensureIsNullableObject<TValue extends object>(
  predicate: (value: object) => value is TValue = (value): value is TValue =>
    Boolean(value)
): (value: unknown) => TValue | undefined {
  return (value) =>
    typeof value === 'object' && value !== null && predicate(value)
      ? value
      : undefined;
}

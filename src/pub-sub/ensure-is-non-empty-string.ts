export function ensureIsNonEmptyString(): (
  value: unknown
) => string | undefined {
  return (value) =>
    typeof value === 'string' && value.length > 0 ? value : undefined;
}

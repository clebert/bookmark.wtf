export type LiteralValue = boolean | number | string;

export function ensureIsLiteralType<TValues extends readonly LiteralValue[]>(
  values: TValues,
  defaultValue: TValues[number]
): (value: unknown) => TValues[number] {
  return (value) =>
    values.includes(value as TValues[number])
      ? (value as TValues[number])
      : defaultValue;
}

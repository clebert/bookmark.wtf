export type Literal = boolean | number | string;

export function isLiteral<TValues extends readonly Literal[]>(
  values: TValues,
): (value: unknown) => value is TValues[number] {
  return (value): value is TValues[number] =>
    values.includes(value as TValues[number]);
}

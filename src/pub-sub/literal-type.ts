import {Transformer} from './topic';

export type LiteralValue = boolean | number | string;

export function literalType<TValues extends readonly LiteralValue[]>(
  values: TValues,
  defaultValue: TValues[number]
): Transformer<LiteralValue | undefined, TValues[number]> {
  return (value) =>
    values.includes(value as TValues[number])
      ? (value as TValues[number])
      : defaultValue;
}

import type {z} from 'zod';

export function deserializeJson<TSchema extends z.ZodType>(
  text: string,
  schema: TSchema,
): z.TypeOf<TSchema> | undefined {
  try {
    return schema.parse(JSON.parse(text));
  } catch {
    return undefined;
  }
}

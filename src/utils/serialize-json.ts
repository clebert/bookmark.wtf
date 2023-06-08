export function serializeJson(value: unknown): string | undefined {
  if (typeof value === `number`) {
    return isFinite(value) ? JSON.stringify(value) : undefined;
  }

  return value != null ? JSON.stringify(value) : undefined;
}

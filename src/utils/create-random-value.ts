export function createRandomValue(): string {
  return String(crypto.getRandomValues(new Uint32Array(1))[0]);
}

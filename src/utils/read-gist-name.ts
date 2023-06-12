export function readGistName(): string {
  const [, gistName = ``] = location.pathname.split(`/`);

  return gistName;
}

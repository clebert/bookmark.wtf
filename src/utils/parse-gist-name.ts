export function parseGistName(url: string): string | undefined {
  const result = /gist\.github\.com(\/[^\/]+)(\/[^\/]+)?$/.exec(url);
  const gistName = (result?.[2] || result?.[1])?.slice(1);

  return gistName || undefined;
}

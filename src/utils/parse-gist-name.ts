export function parseGistName(url: string): string | undefined {
  return parseFromGitHubUrl(url) || parseFromBookmarkWtfUrl(url) || undefined;
}

function parseFromGitHubUrl(url: string): string | undefined {
  const result = /gist\.github\.com(\/[^\/]+)(\/[^\/]+)?$/.exec(url);

  return (result?.[2] || result?.[1])?.slice(1);
}

function parseFromBookmarkWtfUrl(url: string): string | undefined {
  const result = /bookmark\.wtf(\/[^\/]+)$/.exec(url);

  return result?.[1]!.slice(1);
}

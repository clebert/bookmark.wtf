export function writeGistName(gistName: string): void {
  const url = new URL(location.href);

  url.pathname = `/${gistName}`;

  if (url.href !== location.href) {
    history.pushState(undefined, ``, url.href);
  }
}

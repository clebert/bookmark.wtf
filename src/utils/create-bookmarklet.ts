function addBookmark(): void {
  const url = new URL(process.env.APP_BASE_URL! + '/<GIST_NAME>');

  url.searchParams.set('title', document.title);
  url.searchParams.set('url', window.location.href);

  window.location.href = url.href;
}

export function createBookmarklet(gistName: string): string {
  return `javascript:(${addBookmark
    .toString()
    .replace('<GIST_NAME>', gistName)})()`;
}

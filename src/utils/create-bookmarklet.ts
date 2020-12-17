function addBookmark(): void {
  const url = new URL(process.env.APP_BASE_URL! + '/<GIST_NAME>');

  const titleElement: HTMLMetaElement | null = document.querySelector(
    'meta[property="title"]'
  );

  const ogTitleElement: HTMLMetaElement | null = document.querySelector(
    'meta[property="og:title"]'
  );

  url.searchParams.set(
    'title',
    titleElement?.content || ogTitleElement?.content || document.title
  );

  const canonicalUrlElement: HTMLLinkElement | null = document.querySelector(
    'link[rel="canonical"]'
  );

  const ogUrlElement: HTMLMetaElement | null = document.querySelector(
    'meta[property="og:url"]'
  );

  url.searchParams.set(
    'url',
    canonicalUrlElement?.href || ogUrlElement?.content || window.location.href
  );

  window.location.href = url.href;
}

export function createBookmarklet(gistName: string): string {
  return `javascript:(${addBookmark
    .toString()
    .replace('<GIST_NAME>', gistName)})()`;
}

export interface Bookmarklet {
  readonly version: string;
  readonly url: string;
}

export function createBookmarklet(gistName: string): Bookmarklet {
  const version = '1';

  const url = `javascript:(${addBookmark
    .toString()
    .replace('<GIST_NAME>', gistName)
    .replace('<VERSION>', version)})()`;

  return {version, url};
}

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

  url.searchParams.set('version', '<VERSION>');

  window.location.href = url.href;
}

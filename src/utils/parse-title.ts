import {load} from 'cheerio';

export function parseTitle(html: string): string {
  const $ = load(html);

  return (
    $('meta[property="og:title"]').attr()?.content?.trim() ||
    $('meta[name="title"]').attr()?.content?.trim() ||
    $('title').text().trim() ||
    'No title'
  );
}

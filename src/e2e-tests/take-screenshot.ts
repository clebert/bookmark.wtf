import {Page} from 'playwright-webkit';
import {BookmarkWTF} from './bookmark-wtf';

export async function takeScreenshot(
  origin: string,
  page: Page,
  colorScheme: 'light' | 'dark'
): Promise<void> {
  await page.setViewportSize({width: 1024, height: 200});

  await page.goto(origin + '/9803bde974539a8992c0515b28db439b', {
    waitUntil: 'networkidle',
  });

  await page.click('body'); // Blur search input
  await page.click(BookmarkWTF.Topbar().ColorSchemeButton().selector);

  if (colorScheme === 'light') {
    await page.click(BookmarkWTF.Topbar().ColorSchemeButton().selector);
  }

  await page.click(BookmarkWTF.BookmarkControl().SortOrderButton().selector);

  await page.screenshot({
    path: `screenshot-${colorScheme}-mode.png`,
    fullPage: true,
  });

  await page.click(BookmarkWTF.BookmarkControl().SortOrderButton().selector);
  await page.click(BookmarkWTF.BookmarkControl().SortOrderButton().selector);
  await page.click(BookmarkWTF.Topbar().ColorSchemeButton().selector);

  if (colorScheme === 'dark') {
    await page.click(BookmarkWTF.Topbar().ColorSchemeButton().selector);
  }
}

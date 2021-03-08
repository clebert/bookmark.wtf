import {Page} from 'playwright-webkit';

export async function takeScreenshot(
  origin: string,
  page: Page,
  colorScheme: 'light' | 'dark'
): Promise<void> {
  await page.evaluate((_colorScheme) => {
    localStorage.setItem('colorSchemeSelection', _colorScheme);
    localStorage.setItem('sortOrder', 'timeAsc');
  }, colorScheme);

  await page.setViewportSize({width: 1024, height: 200});

  await page.goto(origin + '/9803bde974539a8992c0515b28db439b', {
    waitUntil: 'networkidle',
  });

  await page.click('body'); // Blur search input

  await page.screenshot({
    path: `screenshot-${colorScheme}-mode.png`,
    fullPage: true,
  });
}

import {app} from './app.js';
import {Session} from './session.js';
import {test} from '@playwright/test';

test(`taking a screenshot in light mode`, async ({browser, page}) => {
  await takeScreenshot(new Session(browser, page), `light`);
});

test(`taking a screenshot in dark mode`, async ({browser, page}) => {
  await takeScreenshot(new Session(browser, page), `dark`);
});

async function takeScreenshot(
  session: Session,
  colorScheme: 'light' | 'dark',
): Promise<void> {
  await session.page.goto(`/9803bde974539a8992c0515b28db439b`, {
    waitUntil: `networkidle`,
  });

  await session.page.click(`body`); // Blur search input
  await session.click(app.topbar.colorSchemeButton);

  if (colorScheme === `light`) {
    await session.click(app.topbar.colorSchemeButton);
  }

  await session.click(app.bookmarkControl.sortOrderButton);

  await session.page.screenshot({
    path: `screenshot-${colorScheme}-mode.png`,
    fullPage: true,
  });

  await session.click(app.bookmarkControl.sortOrderButton);
  await session.click(app.bookmarkControl.sortOrderButton);
  await session.click(app.topbar.colorSchemeButton);

  if (colorScheme === `dark`) {
    await session.click(app.topbar.colorSchemeButton);
  }
}

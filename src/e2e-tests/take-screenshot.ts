import {app} from './app.js';
import type {Session} from './session.js';

export async function takeScreenshot(
  session: Session,
  origin: string,
  colorScheme: 'light' | 'dark',
): Promise<void> {
  await session.page.setViewportSize({width: 1024, height: 200});

  await session.page.goto(origin + `/9803bde974539a8992c0515b28db439b`, {
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

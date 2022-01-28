import type {API} from './api';
import {app} from './app';

export async function takeScreenshot(
  api: API,
  origin: string,
  colorScheme: 'light' | 'dark',
): Promise<void> {
  await api.page.setViewportSize({width: 1024, height: 200});

  await api.page.goto(origin + `/9803bde974539a8992c0515b28db439b`, {
    waitUntil: `networkidle`,
  });

  await api.page.click(`body`); // Blur search input
  await api.click(app.topbar.colorSchemeButton);

  if (colorScheme === `light`) {
    await api.click(app.topbar.colorSchemeButton);
  }

  await api.click(app.bookmarkControl.sortOrderButton);

  await api.page.screenshot({
    path: `screenshot-${colorScheme}-mode.png`,
    fullPage: true,
  });

  await api.click(app.bookmarkControl.sortOrderButton);
  await api.click(app.bookmarkControl.sortOrderButton);
  await api.click(app.topbar.colorSchemeButton);

  if (colorScheme === `dark`) {
    await api.click(app.topbar.colorSchemeButton);
  }
}

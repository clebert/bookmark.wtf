import {API} from './api';
import {App} from './app';

export async function takeScreenshot(
  api: API,
  origin: string,
  colorScheme: 'light' | 'dark'
): Promise<void> {
  await api.page.setViewportSize({width: 1024, height: 200});

  await api.page.goto(origin + '/9803bde974539a8992c0515b28db439b', {
    waitUntil: 'networkidle',
  });

  await api.page.click('body'); // Blur search input
  await api.click(App().Topbar().ColorSchemeButton());

  if (colorScheme === 'light') {
    await api.click(App().Topbar().ColorSchemeButton());
  }

  await api.click(App().BookmarkControl().SortOrderButton());

  await api.page.screenshot({
    path: `screenshot-${colorScheme}-mode.png`,
    fullPage: true,
  });

  await api.click(App().BookmarkControl().SortOrderButton());
  await api.click(App().BookmarkControl().SortOrderButton());
  await api.click(App().Topbar().ColorSchemeButton());

  if (colorScheme === 'dark') {
    await api.click(App().Topbar().ColorSchemeButton());
  }
}

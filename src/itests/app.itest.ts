import {Browser, webkit} from 'playwright-webkit';
import {App} from './app';

describe('App', () => {
  let browser: Browser;
  let app: App;

  beforeAll(async () => {
    browser = await webkit.launch();
    app = new App(await browser.newPage());

    app.page.on('console', console.debug);
  });

  afterAll(async () => {
    await browser.close();
  });

  test('signing in', async () => {
    const url = app.origin + '/9803bde974539a8992c0515b28db439b?foo=bar';

    await app.page.goto(url);
    await app.signIn();

    expect(await app.page.url()).toBe(url);
  });

  test('take screenshot in light mode', async () => {
    await app.page.evaluate(() => {
      localStorage.setItem('colorSchemeSelection', 'light');
      localStorage.setItem('sortOrder', 'timeAsc');
    });

    await app.page.setViewportSize({width: 1024, height: 500});

    await app.page.goto(app.origin + '/9803bde974539a8992c0515b28db439b', {
      waitUntil: 'networkidle',
    });

    // Blur search field
    await app.page.click('body');

    await app.page.screenshot({
      path: 'screenshot-light-mode.png',
      fullPage: true,
    });
  });

  test('take screenshot in dark mode', async () => {
    await app.page.evaluate(() => {
      localStorage.setItem('colorSchemeSelection', 'dark');
      localStorage.setItem('sortOrder', 'timeAsc');
    });

    await app.page.setViewportSize({width: 1024, height: 500});

    await app.page.goto(app.origin + '/9803bde974539a8992c0515b28db439b', {
      waitUntil: 'networkidle',
    });

    // Blur search field
    await app.page.click('body');

    await app.page.screenshot({
      path: 'screenshot-dark-mode.png',
      fullPage: true,
    });
  });
});

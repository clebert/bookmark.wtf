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
    await app.page.goto(app.baseUrl, {waitUntil: 'networkidle'});
    await app.signIn();

    expect(await app.page.url()).toBe(app.baseUrl + '/');
  });

  test('take screenshot', async () => {
    await app.page.setViewportSize({width: 1024, height: 500});

    await app.page.goto(app.baseUrl + '/9803bde974539a8992c0515b28db439b', {
      waitUntil: 'networkidle',
    });

    await app.page.click('"Edit bookmarks"');

    await app.page.screenshot({
      path: 'screenshot.png',
      fullPage: true,
      omitBackground: true,
    });
  });
});

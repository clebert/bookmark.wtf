import {Browser, webkit} from 'playwright-webkit';
import {App} from './app';

const botwtfGistName = '9803bde974539a8992c0515b28db439b';
const clebertGistName = 'c8ddcf1dd5112399e97923508ed0ab56';

describe('App', () => {
  let browser: Browser;
  let app: App;

  beforeEach(async () => {
    browser = await webkit.launch();
    app = new App(await browser.newPage());

    app.page.on('console', console.debug);
  });

  afterEach(async () => {
    await browser.close();
  });

  test('signing in without a bookmark', async () => {
    await app.page.goto(app.baseUrl, {waitUntil: 'networkidle'});
    await app.signIn();

    expect(await app.page.url()).toBe(app.baseUrl + '/');
  });

  test('signing in with a bookmark', async () => {
    const url = new URL(app.baseUrl);

    url.pathname = '/' + botwtfGistName;

    url.searchParams.set('title', 'Example Domain');
    url.searchParams.set('url', 'http://example.com');

    await app.page.goto(url.href, {waitUntil: 'networkidle'});
    await app.signIn();

    expect(await app.page.url()).toBe(url.href);
  });

  test('signing in with a locked bookmark', async () => {
    const url = new URL(app.baseUrl);

    url.pathname = '/' + clebertGistName;

    url.searchParams.set('title', 'Example Domain');
    url.searchParams.set('url', 'http://example.com');

    await app.page.goto(url.href, {waitUntil: 'networkidle'});
    await app.signIn();

    expect(await app.page.url()).toBe(app.baseUrl + url.pathname);
  });

  test('take screenshot', async () => {
    if (!/localhost/.test(app.baseUrl)) {
      return;
    }

    await app.page.setViewportSize({width: 1024, height: 500});

    await app.page.goto(app.baseUrl + '/' + botwtfGistName, {
      waitUntil: 'networkidle',
    });

    await app.signIn();
    await app.page.click('"Edit bookmarks"');

    await app.page.screenshot({
      path: 'screenshot.png',
      fullPage: true,
      omitBackground: true,
    });
  });
});

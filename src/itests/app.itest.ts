import {Browser, webkit} from 'playwright-webkit';
import {App} from './app';

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

    url.pathname = '/c7d42e9ba901e47f338e53868816553f';

    url.searchParams.set('title', 'Example Domain');
    url.searchParams.set('url', 'http://example.com');

    await app.page.goto(url.href, {waitUntil: 'networkidle'});
    await app.signIn();

    expect(await app.page.url()).toBe(url.href);
  });

  test('signing in with a locked bookmark', async () => {
    const url = new URL(app.baseUrl);

    url.pathname = '/c8ddcf1dd5112399e97923508ed0ab56';

    url.searchParams.set('title', 'Example Domain');
    url.searchParams.set('url', 'http://example.com');

    await app.page.goto(url.href, {waitUntil: 'networkidle'});
    await app.signIn();

    expect(await app.page.url()).toBe(app.baseUrl + url.pathname);
  });
});

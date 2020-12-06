import {Browser, Page, webkit} from 'playwright';
import {App} from './app';

describe('App', () => {
  let browser: Browser;
  let page: Page;
  let app: App;

  beforeEach(async () => {
    browser = await webkit.launch();
    page = await browser.newPage();
    app = new App(page);
  });

  afterEach(async () => {
    await browser.close();
  });

  test('signing in without a gist name', async () => {
    const url = 'https://bookmark.wtf/';

    await page.goto(url, {waitUntil: 'networkidle'});
    await app.signIn();

    expect(await page.url()).toBe(url);
  });

  test('signing in with a gist name', async () => {
    const url = 'https://bookmark.wtf/c8ddcf1dd5112399e97923508ed0ab56';

    await page.goto(url, {waitUntil: 'networkidle'});
    await app.signIn();

    expect(await page.url()).toBe(url);
  });
});

import {Browser, webkit} from 'playwright-webkit';
import {hasText} from '../pageobjects/has-text';
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
    await app.setColorScheme('light');
    await app.setSortOrder('timeAsc');
    await app.setOptimalViewportSize();

    await app.page.goto(app.origin + '/9803bde974539a8992c0515b28db439b', {
      waitUntil: 'networkidle',
    });

    await app.blurAllControls();

    await app.page.screenshot({
      path: 'screenshot-light-mode.png',
      fullPage: true,
    });
  });

  test('take screenshot in dark mode', async () => {
    await app.setColorScheme('dark');
    await app.setSortOrder('timeAsc');
    await app.setOptimalViewportSize();

    await app.page.goto(app.origin + '/9803bde974539a8992c0515b28db439b', {
      waitUntil: 'networkidle',
    });

    await app.blurAllControls();

    await app.page.screenshot({
      path: 'screenshot-dark-mode.png',
      fullPage: true,
    });
  });

  test('create a collection and then delete it again', async () => {
    await app.page.goto(app.origin);
    await app.page.click(app.CollectionControl().$$.NewButton().$);

    const description = 'Collection' + Date.now();

    await app.page.type(
      app.NewCollectionForm().$$.DescriptionInput().$,
      description,
      {delay: 100}
    );

    await app.page.click(app.NewCollectionForm().$$.CreateButton().$);

    const collectionItem = app.CollectionItems(hasText(description));

    await app.page.waitForSelector(collectionItem.$);
    await app.page.click(app.CollectionControl().$$.ZenButton().$);
    await app.page.click(collectionItem.$$.DeleteButton().$);
    await app.page.waitForTimeout(100);
    await app.page.click(collectionItem.$$.DeleteButton().$);
  });
});

import {Browser, Page, webkit} from 'playwright-webkit';
import speakeasy from 'speakeasy';
import {assertIsString} from '../utils/assert-is-string';
import {BookmarkWTF} from './bookmark-wtf';
import {GithubCOM} from './github-com';
import {hasText} from './has-text';
import {takeScreenshot} from './take-screenshot';

const origin = process.env.ITEST_ORIGIN;

assertIsString(origin, 'process.env.ITEST_ORIGIN');

describe('bookmark.wtf', () => {
  let browser: Browser;
  let page: Page;
  let collectionDescription: string;

  beforeAll(async () => {
    browser = await webkit.launch();
    page = await browser.newPage();
    collectionDescription = 'Collection' + Date.now();

    page.on('console', console.debug);
  });

  afterAll(async () => {
    await browser.close();
  });

  test('signing in', async () => {
    const login = process.env.ITEST_LOGIN;
    const password = process.env.ITEST_PASSWORD;
    const secret = process.env.ITEST_SECRET;

    assertIsString(login, 'process.env.ITEST_LOGIN');
    assertIsString(password, 'process.env.ITEST_PASSWORD');
    assertIsString(secret, 'process.env.ITEST_SECRET');

    const url = origin + '/9803bde974539a8992c0515b28db439b?foo=bar';

    await page.goto(url);
    await page.click(BookmarkWTF.Topbar().SignInButton().selector);
    await page.fill(GithubCOM.LoginPage().LoginInput().selector, login);
    await page.fill(GithubCOM.LoginPage().PasswordInput().selector, password);
    await page.click(GithubCOM.LoginPage().SignInButton().selector);

    await page.fill(
      GithubCOM.TwoFactorPage().OTPInput().selector,
      speakeasy.totp({secret, encoding: 'base32'})
    );

    await page.click(GithubCOM.TwoFactorPage().VerifyButton().selector);
    await page.waitForSelector(BookmarkWTF.Topbar().SignOutButton().selector);

    expect(await page.url()).toBe(url);
  });

  test('taking a screenshot in light mode', async () => {
    await takeScreenshot(origin, page, 'light');
  });

  test('taking a screenshot in dark mode', async () => {
    await takeScreenshot(origin, page, 'dark');
  });

  test('creating a collection', async () => {
    await page.goto(origin);
    await page.click(BookmarkWTF.CollectionControl().NewButton().selector);

    await page.type(
      BookmarkWTF.NewCollectionForm().DescriptionInput().selector,
      collectionDescription,
      {delay: 100}
    );

    await page.click(BookmarkWTF.NewCollectionForm().CreateButton().selector);

    const collectionItem = BookmarkWTF.CollectionItems(
      hasText(collectionDescription)
    );

    await page.waitForSelector(collectionItem.selector);
  });

  test('deleting a collection', async () => {
    await page.goto(origin);

    const collectionItem = BookmarkWTF.CollectionItems(
      hasText(collectionDescription)
    );

    await page.click(BookmarkWTF.CollectionControl().ZenButton().selector);
    await page.click(collectionItem.DeleteButton().selector);
    await page.waitForTimeout(100);
    await page.click(collectionItem.DeleteButton().selector);
    await page.waitForTimeout(100);

    expect(await page.$(collectionItem.selector)).toBeNull();
  });
});

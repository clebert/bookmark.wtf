import {Browser, Page, webkit} from 'playwright-webkit';
import speakeasy from 'speakeasy';
import {hasText} from '../pageobjects/has-text';
import {assertIsString} from '../utils/assert-is-string';
import {BookmarkWTF} from './bookmark-wtf';
import {GithubCOM} from './github-com';
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
    await page.click(BookmarkWTF.Topbar().$$.SignInButton().$);
    await page.fill(GithubCOM.LoginPage().$$.LoginInput().$, login);
    await page.fill(GithubCOM.LoginPage().$$.PasswordInput().$, password);
    await page.click(GithubCOM.LoginPage().$$.SignInButton().$);

    await page.fill(
      GithubCOM.TwoFactorPage().$$.OTPInput().$,
      speakeasy.totp({secret, encoding: 'base32'})
    );

    await page.click(GithubCOM.TwoFactorPage().$$.VerifyButton().$);
    await page.waitForSelector(BookmarkWTF.Topbar().$$.SignOutButton().$);

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
    await page.click(BookmarkWTF.CollectionControl().$$.NewButton().$);

    await page.type(
      BookmarkWTF.NewCollectionForm().$$.DescriptionInput().$,
      collectionDescription,
      {delay: 100}
    );

    await page.click(BookmarkWTF.NewCollectionForm().$$.CreateButton().$);

    const collectionItem = BookmarkWTF.CollectionItems(
      hasText(collectionDescription)
    );

    await page.waitForSelector(collectionItem.$);
  });

  test('deleting a collection', async () => {
    await page.goto(origin);

    const collectionItem = BookmarkWTF.CollectionItems(
      hasText(collectionDescription)
    );

    await page.click(BookmarkWTF.CollectionControl().$$.ZenButton().$);
    await page.click(collectionItem.$$.DeleteButton().$);
    await page.waitForTimeout(100);
    await page.click(collectionItem.$$.DeleteButton().$);
    await page.waitForTimeout(100);

    expect(await page.$(collectionItem.$)).toBeNull();
  });
});

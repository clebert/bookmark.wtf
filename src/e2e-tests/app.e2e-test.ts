import speakeasy from 'speakeasy';
import {assertIsString} from '../utils/assert-is-string';
import {API} from './api';
import {App} from './app';
import {Github} from './github';
import {takeScreenshot} from './take-screenshot';

const origin = process.env.E2E_TEST_ORIGIN;

assertIsString(origin, 'process.env.E2E_TEST_ORIGIN');

describe('bookmark.wtf', () => {
  let api: API;
  let uid: string;

  beforeAll(async () => {
    api = await API.webkit();
    uid = String(Date.now());
  });

  afterAll(async () => {
    await api.browser.close();
  });

  test('signing in', async () => {
    const login = process.env.E2E_TEST_LOGIN;
    const password = process.env.E2E_TEST_PASSWORD;
    const secret = process.env.E2E_TEST_SECRET;

    assertIsString(login, 'process.env.E2E_TEST_LOGIN');
    assertIsString(password, 'process.env.E2E_TEST_PASSWORD');
    assertIsString(secret, 'process.env.E2E_TEST_SECRET');

    const url = origin + '/9803bde974539a8992c0515b28db439b?foo=bar';

    await api.page.goto(url);
    await api.click(App().Topbar().SignInButton());
    await api.fill(Github().LoginPage().LoginField(), login);
    await api.fill(Github().LoginPage().PasswordField(), password);
    await api.click(Github().LoginPage().SignInButton());

    await api.fill(
      Github().TwoFactorPage().OTPField(),
      speakeasy.totp({secret, encoding: 'base32'})
    );

    await api.click(Github().TwoFactorPage().VerifyButton());
    await api.exists(App().Topbar().SignOutButton());

    expect(await api.page.url()).toBe(url);
  });

  test('taking a screenshot in light mode', async () => {
    await takeScreenshot(api, origin, 'light');
  });

  test('taking a screenshot in dark mode', async () => {
    await takeScreenshot(api, origin, 'dark');
  });

  test('cancel creating a collection', async () => {
    await api.page.goto(origin);
    await api.click(App().CollectionControl().NewButton());
    await api.doesNotExist(App().CollectionControl());
    await api.fill(App().NewCollectionForm().DescriptionField(), 'foo' + uid);
    await api.click(App().NewCollectionForm().CancelButton());
    await api.doesNotExist(App().NewCollectionForm());
    await api.doesNotExist(App().CollectionItems(api.hasText('foo' + uid)));
    await api.exists(App().CollectionControl());
  });

  test('creating a collection', async () => {
    await api.page.goto(origin);
    await api.click(App().CollectionControl().NewButton());
    await api.doesNotExist(App().CollectionControl());
    await api.fill(App().NewCollectionForm().DescriptionField(), 'foo' + uid);

    const response = api.page.waitForResponse(/github/);

    await api.click(App().NewCollectionForm().CreateButton());
    await api.doesNotExist(App().NewCollectionForm());
    await api.exists(App().CollectionItems(api.hasText('foo' + uid)));
    await api.exists(App().CollectionControl());

    await response;
  });

  test('cancel editing a collection', async () => {
    const collectionItem = App().CollectionItems(api.hasText('foo' + uid));
    const editCollectionForm = App().EditCollectionForms(api.firstChild);

    await api.page.goto(origin);
    await api.click(App().CollectionControl().ZenButton());
    await api.click(collectionItem.EditButton());
    await api.doesNotExist(collectionItem);
    await api.fill(editCollectionForm.DescriptionField(), 'bar' + uid);
    await api.click(editCollectionForm.CancelButton());
    await api.doesNotExist(editCollectionForm);
    await api.doesNotExist(App().CollectionItems(api.hasText('bar' + uid)));
    await api.exists(collectionItem);
  });

  test('editing a collection', async () => {
    const collectionItem = App().CollectionItems(api.hasText('foo' + uid));
    const editCollectionForm = App().EditCollectionForms(api.firstChild);

    await api.page.goto(origin);
    await api.click(App().CollectionControl().ZenButton());
    await api.click(collectionItem.EditButton());
    await api.doesNotExist(collectionItem);
    await api.fill(editCollectionForm.DescriptionField(), 'bar' + uid);

    const response = api.page.waitForResponse(/github/);

    await api.click(editCollectionForm.UpdateButton());
    await api.doesNotExist(editCollectionForm);
    await api.exists(App().CollectionItems(api.hasText('bar' + uid)));
    await api.doesNotExist(collectionItem);

    await response;
  });

  test('deleting a collection', async () => {
    const collectionItem = App().CollectionItems(api.hasText('bar' + uid));

    await api.page.goto(origin);
    await api.click(App().CollectionControl().ZenButton());
    await api.click(collectionItem.DeleteButton());

    const response = api.page.waitForResponse(/github/);

    await api.click(collectionItem.DeleteButton());
    await api.doesNotExist(collectionItem);

    await response;
  });
});

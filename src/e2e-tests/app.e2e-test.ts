import speakeasy from 'speakeasy';
import {assertIsString} from '../utils/assert-is-string';
import {API} from './api';
import {app} from './app';
import {containsText} from './contains-text';
import {github} from './github';
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
    await api.click(app.topbar.SignInButton);
    await api.fill(github.loginPage.LoginField, login);
    await api.fill(github.loginPage.PasswordField, password);
    await api.click(github.loginPage.SignInButton);

    await api.fill(
      github.twoFactorPage.OTPField,
      speakeasy.totp({secret, encoding: 'base32'})
    );

    await api.click(github.twoFactorPage.VerifyButton);
    await api.exists(app.topbar.SignOutButton);

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
    await api.click(app.collectionControl.NewButton);
    await api.doesNotExist(app.CollectionControl);
    await api.fill(app.newCollectionForm.DescriptionField, 'foo' + uid);
    await api.click(app.newCollectionForm.CancelButton);
    await api.doesNotExist(app.NewCollectionForm);

    await api.doesNotExist(
      app.CollectionItems.filter(containsText('foo' + uid))
    );

    await api.exists(app.CollectionControl);
  });

  test('creating a collection', async () => {
    await api.page.goto(origin);
    await api.click(app.collectionControl.NewButton);
    await api.doesNotExist(app.CollectionControl);
    await api.fill(app.newCollectionForm.DescriptionField, 'foo' + uid);

    const response = api.page.waitForResponse(/github/);

    await api.click(app.newCollectionForm.CreateButton);
    await api.doesNotExist(app.NewCollectionForm);
    await api.exists(app.CollectionItems.filter(containsText('foo' + uid)));
    await api.exists(app.CollectionControl);

    await response;
  });

  test('cancel editing a collection', async () => {
    const CollectionItem = app.CollectionItems.filter(
      containsText('foo' + uid)
    );

    const EditCollectionForm = app.EditCollectionForms.filter(1);

    await api.page.goto(origin);
    await api.click(app.collectionControl.ZenButton);
    await api.click(app.collectionItems(CollectionItem).EditButton);
    await api.doesNotExist(CollectionItem);

    await api.fill(
      app.editCollectionForms(EditCollectionForm).DescriptionField,
      'bar' + uid
    );

    await api.click(app.editCollectionForms(EditCollectionForm).CancelButton);
    await api.doesNotExist(EditCollectionForm);

    await api.doesNotExist(
      app.CollectionItems.filter(containsText('bar' + uid))
    );

    await api.exists(CollectionItem);
  });

  test('editing a collection', async () => {
    const CollectionItem = app.CollectionItems.filter(
      containsText('foo' + uid)
    );

    const EditCollectionForm = app.EditCollectionForms.filter(1);

    await api.page.goto(origin);
    await api.click(app.collectionControl.ZenButton);
    await api.click(app.collectionItems(CollectionItem).EditButton);
    await api.doesNotExist(CollectionItem);

    await api.fill(
      app.editCollectionForms(EditCollectionForm).DescriptionField,
      'bar' + uid
    );
    const response = api.page.waitForResponse(/github/);

    await api.click(app.editCollectionForms(EditCollectionForm).UpdateButton);
    await api.doesNotExist(EditCollectionForm);
    await api.exists(app.CollectionItems.filter(containsText('bar' + uid)));
    await api.doesNotExist(CollectionItem);

    await response;
  });

  test('deleting a collection', async () => {
    const CollectionItem = app.CollectionItems.filter(
      containsText('bar' + uid)
    );

    await api.page.goto(origin);
    await api.click(app.collectionControl.ZenButton);
    await api.click(app.collectionItems(CollectionItem).DeleteButton);

    const response = api.page.waitForResponse(/github/);

    await api.click(app.collectionItems(CollectionItem).DeleteButton);
    await api.doesNotExist(CollectionItem);

    await response;
  });
});

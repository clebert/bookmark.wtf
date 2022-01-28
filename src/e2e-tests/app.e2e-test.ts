import speakeasy from 'speakeasy';
import {assertIsString} from '../utils/assert-is-string';
import {API} from './api';
import {app} from './app';
import {containsText} from './contains-text';
import {github} from './github';
import {takeScreenshot} from './take-screenshot';

const origin = process.env.E2E_TEST_ORIGIN;

assertIsString(origin, `process.env.E2E_TEST_ORIGIN`);

describe(`bookmark.wtf`, () => {
  let api: API;
  let uid: string;

  beforeAll(async () => {
    api = await API.webkit();
    uid = String(Date.now());
  });

  afterAll(async () => {
    await api.browser.close();
  });

  test(`signing in`, async () => {
    const login = process.env.E2E_TEST_LOGIN;
    const password = process.env.E2E_TEST_PASSWORD;
    const secret = process.env.E2E_TEST_SECRET;

    assertIsString(login, `process.env.E2E_TEST_LOGIN`);
    assertIsString(password, `process.env.E2E_TEST_PASSWORD`);
    assertIsString(secret, `process.env.E2E_TEST_SECRET`);

    const url = origin + `/9803bde974539a8992c0515b28db439b?foo=bar`;

    await api.page.goto(url);
    await api.click(app.topbar.signInButton);
    await api.fill(github.loginField, login);
    await api.fill(github.passwordField, password);
    await api.click(github.primaryButton);

    await api.fill(
      github.otpField,
      speakeasy.totp({secret, encoding: `base32`}),
    );

    await Promise.race([
      api
        .click(github.primaryButton)
        .then(async () => api.exists(app.topbar.signOutButton)),

      api.exists(app.topbar.signOutButton),
    ]);

    expect(api.page.url()).toBe(url);
  });

  test(`taking a screenshot in light mode`, async () => {
    await takeScreenshot(api, origin, `light`);
  });

  test(`taking a screenshot in dark mode`, async () => {
    await takeScreenshot(api, origin, `dark`);
  });

  test(`cancel creating a collection`, async () => {
    await api.page.goto(origin);
    await api.click(app.collectionControl.newButton);
    await api.fill(app.newCollectionForm.descriptionField, `foo` + uid);
    await api.click(app.newCollectionForm.cancelButton);
    await api.doesNotExist(app.collectionItem(containsText(`foo` + uid)).self);
  });

  test(`creating a collection`, async () => {
    await api.page.goto(origin);
    await api.click(app.collectionControl.newButton);
    await api.fill(app.newCollectionForm.descriptionField, `foo` + uid);

    const response = api.page.waitForResponse(/github/);

    await api.click(app.newCollectionForm.createButton);
    await api.exists(app.collectionItem(containsText(`foo` + uid)).self);

    await response;
  });

  test(`cancel updating a collection`, async () => {
    await api.page.goto(origin);
    await api.click(app.collectionItem(containsText(`foo` + uid)).editButton);
    await api.fill(app.editCollectionForm(1).descriptionField, `bar` + uid);
    await api.click(app.editCollectionForm(1).cancelButton);
    await api.doesNotExist(app.collectionItem(containsText(`bar` + uid)).self);
    await api.exists(app.collectionItem(containsText(`foo` + uid)).self);
  });

  test(`updating a collection`, async () => {
    await api.page.goto(origin);
    await api.click(app.collectionItem(containsText(`foo` + uid)).editButton);
    await api.fill(app.editCollectionForm(1).descriptionField, `bar` + uid);

    const response = api.page.waitForResponse(/github/);

    await api.click(app.editCollectionForm(1).updateButton);
    await api.doesNotExist(app.collectionItem(containsText(`foo` + uid)).self);
    await api.exists(app.collectionItem(containsText(`bar` + uid)).self);

    await response;
  });

  test(`deleting a collection`, async () => {
    await api.page.goto(origin);
    await api.click(app.collectionItem(containsText(`bar` + uid)).deleteButton);

    const response = api.page.waitForResponse(/github/);

    await api.click(app.collectionItem(containsText(`bar` + uid)).deleteButton);
    await api.doesNotExist(app.collectionItem(containsText(`bar` + uid)).self);

    await response;
  });
});

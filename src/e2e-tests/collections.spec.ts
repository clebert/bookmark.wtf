import {app} from './app.js';
import {containsText} from './contains-text.js';
import {Session} from './session.js';
import {test} from '@playwright/test';

const uuid = crypto.randomUUID();

test(`cancel creating a collection`, async ({browser, page}) => {
  const session = new Session(browser, page);

  await session.page.goto(`/`);
  await session.click(app.collectionControl.newButton);
  await session.fill(app.newCollectionForm.descriptionField, `foo${uuid}`);
  await session.click(app.newCollectionForm.cancelButton);

  await session.doesNotExist(
    app.collectionItem(containsText(`foo${uuid}`)).self,
  );
});

test(`creating a collection`, async ({browser, page}) => {
  const session = new Session(browser, page);

  await session.page.goto(`/`);
  await session.click(app.collectionControl.newButton);
  await session.fill(app.newCollectionForm.descriptionField, `foo${uuid}`);

  const response = session.page.waitForResponse(/github/);

  await session.click(app.newCollectionForm.createButton);
  await response;
  await session.exists(app.collectionItem(containsText(`foo${uuid}`)).self);
});

test(`cancel updating a collection`, async ({browser, page}) => {
  const session = new Session(browser, page);

  await session.page.goto(`/`);

  await session.click(
    app.collectionItem(containsText(`foo${uuid}`)).editButton,
  );

  await session.fill(app.editCollectionForm(1).descriptionField, `bar${uuid}`);
  await session.click(app.editCollectionForm(1).cancelButton);

  await session.doesNotExist(
    app.collectionItem(containsText(`bar${uuid}`)).self,
  );

  await session.exists(app.collectionItem(containsText(`foo${uuid}`)).self);
});

test(`updating a collection`, async ({browser, page}) => {
  const session = new Session(browser, page);

  await session.page.goto(`/`);

  await session.click(
    app.collectionItem(containsText(`foo${uuid}`)).editButton,
  );

  await session.fill(app.editCollectionForm(1).descriptionField, `bar${uuid}`);

  const response = session.page.waitForResponse(/github/);

  await session.click(app.editCollectionForm(1).updateButton);
  await response;

  await session.doesNotExist(
    app.collectionItem(containsText(`foo${uuid}`)).self,
  );

  await session.exists(app.collectionItem(containsText(`bar${uuid}`)).self);
});

test(`deleting a collection`, async ({browser, page}) => {
  const session = new Session(browser, page);

  await session.page.goto(`/`);

  const response = session.page.waitForResponse(/github/);

  await session.click(
    app.collectionItem(containsText(`bar${uuid}`)).deleteButton,
  );

  await session.click(
    app.collectionItem(containsText(`bar${uuid}`)).deleteButton,
  );

  await response;

  await session.doesNotExist(
    app.collectionItem(containsText(`bar${uuid}`)).self,
  );
});

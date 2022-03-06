import type {Literal, Primitive} from 'sonnar';
import {NodeSet} from 'sonnar';

const {any, attribute} = NodeSet;
const topbar = any().filter(attribute(`.Topbar`));
const collectionControl = any().filter(attribute(`.CollectionControl`));
const newCollectionForm = any().filter(attribute(`.NewCollectionForm`));
const collectionItems = any().filter(attribute(`.CollectionItem`));
const editCollectionForms = any().filter(attribute(`.EditCollectionForm`));
const bookmarkControl = any().filter(attribute(`.BookmarkControl`));

export const app = {
  topbar: {
    colorSchemeButton: topbar.path(
      any().filter(attribute(`.ColorSchemeButton`)),
    ),

    signInButton: topbar.path(any().filter(attribute(`.SignInButton`))),
    signOutButton: topbar.path(any().filter(attribute(`.SignOutButton`))),
  },

  collectionControl: {
    newButton: collectionControl.path(any().filter(attribute(`.NewButton`))),
  },

  newCollectionForm: {
    descriptionField: newCollectionForm.path(
      any().filter(attribute(`.DescriptionField`)),
    ),

    createButton: newCollectionForm.path(
      any().filter(attribute(`.CreateButton`)),
    ),

    cancelButton: newCollectionForm.path(
      any().filter(attribute(`.CancelButton`)),
    ),
  },

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  collectionItem: (predicate: Literal | Primitive) => {
    const self = collectionItems.filter(predicate).filter(1);

    return {
      self,
      editButton: self.path(any().filter(attribute(`.EditButton`))),
      deleteButton: self.path(any().filter(attribute(`.DeleteButton`))),
    };
  },

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  editCollectionForm: (predicate: Literal | Primitive) => {
    const self = editCollectionForms.filter(predicate).filter(1);

    return {
      self,
      descriptionField: self.path(any().filter(attribute(`.DescriptionField`))),
      updateButton: self.path(any().filter(attribute(`.UpdateButton`))),
      cancelButton: self.path(any().filter(attribute(`.CancelButton`))),
    };
  },

  bookmarkControl: {
    sortOrderButton: bookmarkControl.path(
      any().filter(attribute(`.SortOrderButton`)),
    ),
  },
};

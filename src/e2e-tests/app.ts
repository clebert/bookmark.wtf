import {Literal, NodeSet, Primitive, fn} from 'sonnar';

const {any, attribute, node} = NodeSet;
const topbar = any().filter(attribute('.Topbar'));
const collectionControl = any().filter(attribute('.CollectionControl'));
const newCollectionForm = any().filter(attribute('.NewCollectionForm'));
const collectionItems = any().filter(attribute('.CollectionItem'));
const editCollectionForms = any().filter(attribute('.EditCollectionForm'));
const bookmarkControl = any().filter(attribute('.BookmarkControl'));

export const app = {
  topbar: {
    colorSchemeButton: topbar.path(
      any().filter(attribute('.ColorSchemeButton'))
    ),

    signInButton: topbar.path(any().filter(attribute('.SignInButton'))),
    signOutButton: topbar.path(any().filter(attribute('.SignOutButton'))),
  },

  collectionControl: {
    newButton: collectionControl.path(any().filter(attribute('.NewButton'))),
    zenButton: collectionControl.path(any().filter(attribute('.ZenButton'))),
  },

  newCollectionForm: {
    descriptionField: newCollectionForm.path(
      any().filter(attribute('.DescriptionField'))
    ),

    createButton: newCollectionForm.path(
      any().filter(attribute('.CreateButton'))
    ),

    cancelButton: newCollectionForm.path(
      any().filter(attribute('.CancelButton'))
    ),
  },

  collectionItem: (title: string) => {
    const self = collectionItems.filter(
      fn('contains', fn('normalize-space', node('self')), title)
    );

    return {
      self,
      editButton: self.path(any().filter(attribute('.EditButton'))),
      deleteButton: self.path(any().filter(attribute('.DeleteButton'))),
    };
  },

  editCollectionForm: (position: Literal | Primitive) => {
    const self = editCollectionForms.filter(position);

    return {
      self,
      descriptionField: self.path(any().filter(attribute('.DescriptionField'))),
      updateButton: self.path(any().filter(attribute('.UpdateButton'))),
      cancelButton: self.path(any().filter(attribute('.CancelButton'))),
    };
  },

  bookmarkControl: {
    sortOrderButton: bookmarkControl.path(
      any().filter(attribute('.SortOrderButton'))
    ),
  },
};

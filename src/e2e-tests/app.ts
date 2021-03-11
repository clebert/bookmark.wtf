import {descendant, query} from 'sonnar';

export const App = query('body', {
  Topbar: descendant('.Topbar', {
    ColorSchemeButton: descendant('.ColorSchemeButton', {}),
    SignInButton: descendant('.SignInButton', {}),
    SignOutButton: descendant('.SignOutButton', {}),
  }),

  CollectionControl: descendant('.CollectionControl', {
    NewButton: descendant('.NewButton', {}),
    ZenButton: descendant('.ZenButton', {}),
  }),

  NewCollectionForm: descendant('.NewCollectionForm', {
    DescriptionField: descendant('.DescriptionField', {}),
    CreateButton: descendant('.CreateButton', {}),
    CancelButton: descendant('.CancelButton', {}),
  }),

  CollectionItems: descendant('.CollectionItem', {
    EditButton: descendant('.EditButton', {}),
    DeleteButton: descendant('.DeleteButton', {}),
  }),

  EditCollectionForms: descendant('.EditCollectionForm', {
    DescriptionField: descendant('.DescriptionField', {}),
    UpdateButton: descendant('.UpdateButton', {}),
    CancelButton: descendant('.CancelButton', {}),
  }),

  BookmarkControl: descendant('.BookmarkControl', {
    SortOrderButton: descendant('.SortOrderButton', {}),
  }),
});

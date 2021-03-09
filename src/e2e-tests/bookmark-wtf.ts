import {descendant, query} from 'sonnar';

export class BookmarkWTF {
  static readonly Topbar = query('.Topbar', {
    SignInButton: descendant('.SignInButton', {}),
    SignOutButton: descendant('.SignOutButton', {}),
  });

  static readonly CollectionControl = query('.CollectionControl', {
    NewButton: descendant('.NewButton', {}),
    ZenButton: descendant('.ZenButton', {}),
  });

  static readonly NewCollectionForm = query('.NewCollectionForm', {
    DescriptionInput: descendant('.DescriptionInput', {}),
    CreateButton: descendant('.CreateButton', {}),
  });

  static readonly CollectionItems = query('.CollectionItem', {
    DeleteButton: descendant('.DeleteButton', {}),
  });
}

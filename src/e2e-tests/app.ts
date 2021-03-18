import {NodeSet, select} from 'sonnar';
import {is} from './is';

const Topbar = select('descendant', '*').filter(is('.Topbar'));

const CollectionControl = select('descendant', '*').filter(
  is('.CollectionControl')
);

const NewCollectionForm = select('descendant', '*').filter(
  is('.NewCollectionForm')
);

const CollectionItems = select('descendant', '*').filter(is('.CollectionItem'));

const EditCollectionForms = select('descendant', '*').filter(
  is('.EditCollectionForm')
);

const BookmarkControl = select('descendant', '*').filter(
  is('.BookmarkControl')
);

export const app = {
  Topbar,
  topbar: {
    ColorSchemeButton: Topbar.select('descendant', '*').filter(
      is('.ColorSchemeButton')
    ),

    SignInButton: Topbar.select('descendant', '*').filter(is('.SignInButton')),

    SignOutButton: Topbar.select('descendant', '*').filter(
      is('.SignOutButton')
    ),
  },

  CollectionControl,
  collectionControl: {
    NewButton: CollectionControl.select('descendant', '*').filter(
      is('.NewButton')
    ),

    ZenButton: CollectionControl.select('descendant', '*').filter(
      is('.ZenButton')
    ),
  },

  NewCollectionForm,
  newCollectionForm: {
    DescriptionField: NewCollectionForm.select('descendant', '*').filter(
      is('.DescriptionField')
    ),

    CreateButton: NewCollectionForm.select('descendant', '*').filter(
      is('.CreateButton')
    ),

    CancelButton: NewCollectionForm.select('descendant', '*').filter(
      is('.CancelButton')
    ),
  },

  CollectionItems,
  collectionItems: (CollectionItem: NodeSet) => ({
    EditButton: CollectionItem.select('descendant', '*').filter(
      is('.EditButton')
    ),

    DeleteButton: CollectionItem.select('descendant', '*').filter(
      is('.DeleteButton')
    ),
  }),

  EditCollectionForms,
  editCollectionForms: (EditCollectionForm: NodeSet) => ({
    DescriptionField: EditCollectionForm.select('descendant', '*').filter(
      is('.DescriptionField')
    ),

    UpdateButton: EditCollectionForm.select('descendant', '*').filter(
      is('.UpdateButton')
    ),

    CancelButton: EditCollectionForm.select('descendant', '*').filter(
      is('.CancelButton')
    ),
  }),

  BookmarkControl,
  bookmarkControl: {
    SortOrderButton: BookmarkControl.select('descendant', '*').filter(
      is('.SortOrderButton')
    ),
  },
};

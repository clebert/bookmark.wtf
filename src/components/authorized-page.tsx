import {Fragment, JSX, h} from 'preact';
import {AuthorizedAuthStore} from '../hooks/use-auth-store';
import {useGistName} from '../hooks/use-gist-name';
import {useUserReceiver} from '../hooks/use-user-receiver';
import {AuthorizedTopbar} from './authorized-topbar';
import {BookmarkList} from './bookmark-list';
import {CollectionList} from './collection-list';
import {Page} from './page';
import {SearchForm} from './search-form';

export interface AuthorizedPageProps {
  readonly authStore: AuthorizedAuthStore;
}

export function AuthorizedPage({authStore}: AuthorizedPageProps): JSX.Element {
  const userReceiver = useUserReceiver(authStore);

  if (userReceiver.state === 'failed') {
    throw userReceiver.reason;
  }

  const gistName = useGistName();

  return (
    <Page>
      <AuthorizedTopbar authStore={authStore} userReceiver={userReceiver} />

      {gistName ? (
        <>
          <SearchForm />

          {userReceiver.state === 'successful' && (
            <BookmarkList
              authStore={authStore}
              userReceiver={userReceiver}
              gistName={gistName}
            />
          )}
        </>
      ) : (
        <CollectionList authStore={authStore} />
      )}
    </Page>
  );
}

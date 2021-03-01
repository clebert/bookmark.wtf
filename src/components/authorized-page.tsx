import {JSX, h} from 'preact';
import {AuthorizedAuthStore} from '../hooks/use-auth-store';
import {useGistName} from '../hooks/use-gist-name';
import {useUserReceiver} from '../hooks/use-user-receiver';
import {AuthorizedTopbar} from './authorized-topbar';
import {BookmarkList} from './bookmark-list';
import {CollectionList} from './collection-list';
import {Page} from './page';

export interface AuthorizedPageProps {
  readonly authStore: AuthorizedAuthStore;
}

export function AuthorizedPage({authStore}: AuthorizedPageProps): JSX.Element {
  const userReceiver = useUserReceiver(authStore.token);

  if (userReceiver.state === 'failed') {
    throw userReceiver.reason;
  }

  const gistName = useGistName();

  return (
    <Page>
      <AuthorizedTopbar authStore={authStore} userReceiver={userReceiver} />

      {gistName ? (
        userReceiver.state === 'successful' && (
          <BookmarkList
            authStore={authStore}
            gistName={gistName}
            user={userReceiver.value}
          />
        )
      ) : (
        <CollectionList authStore={authStore} />
      )}
    </Page>
  );
}

import {JSX, h} from 'preact';
import {AuthorizedAuthStore} from '../hooks/use-auth-store';
import {useGistName} from '../hooks/use-gist-name';
import {useUserReceiver} from '../hooks/use-user-receiver';
import {BookmarkList} from './bookmark-list';
import {CollectionList} from './collection-list';
import {Page} from './page';
import {UserTopbar} from './user-topbar';

export interface UserPageProps {
  readonly authStore: AuthorizedAuthStore;
}

export function UserPage({authStore}: UserPageProps): JSX.Element {
  const userReceiver = useUserReceiver(authStore);

  if (userReceiver.state === 'failed') {
    throw userReceiver.reason;
  }

  const gistName = useGistName();

  return (
    <Page>
      <UserTopbar authStore={authStore} />

      {gistName ? (
        userReceiver.state === 'successful' && (
          <BookmarkList
            authStore={authStore}
            userReceiver={userReceiver}
            gistName={gistName}
          />
        )
      ) : (
        <CollectionList authStore={authStore} />
      )}
    </Page>
  );
}

import {JSX} from 'preact';
import {useMemo} from 'preact/hooks';
import {UserAPI} from '../apis/user-api';
import {AuthorizedAuthStore} from '../hooks/use-auth-store';
import {useReceiver} from '../hooks/use-receiver';
import {AppHistory} from '../pub-sub/app-history';
import {BookmarkList} from './bookmark-list';
import {CollectionList} from './collection-list';
import {Page} from './page';
import {UserTopbar} from './user-topbar';

export interface UserPageProps {
  readonly authStore: AuthorizedAuthStore;
}

export function UserPage({authStore}: UserPageProps): JSX.Element {
  const userReceiver = useReceiver(
    useMemo(
      () => UserAPI.init(authStore.token).then(({user}) => user),
      [authStore]
    )
  );

  if (userReceiver.state === 'failed') {
    throw userReceiver.reason;
  }

  const gistName = AppHistory.singleton.useGistName();

  return (
    <Page>
      <UserTopbar authStore={authStore} />

      {gistName ? (
        userReceiver.state === 'successful' && (
          <BookmarkList
            authStore={authStore}
            user={userReceiver.value}
            gistName={gistName}
          />
        )
      ) : (
        <CollectionList authStore={authStore} />
      )}
    </Page>
  );
}

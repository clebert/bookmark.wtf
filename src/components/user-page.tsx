import type {JSX} from 'preact';
import {useMemo} from 'preact/hooks';
import {UserAPI} from '../apis/user-api.js';
import type {AuthorizedAuthStore} from '../hooks/use-auth-store.js';
import {useReceiver} from '../hooks/use-receiver.js';
import {AppTopics} from '../pub-sub/app-topics.js';
import {BookmarkList} from './bookmark-list.js';
import {CollectionList} from './collection-list.js';
import {Page} from './page.js';
import {UserTopbar} from './user-topbar.js';

export interface UserPageProps {
  readonly authStore: AuthorizedAuthStore;
}

export function UserPage({authStore}: UserPageProps): JSX.Element {
  const userReceiver = useReceiver(
    useMemo(
      async () => UserAPI.init(authStore.token).then(({user}) => user),
      [authStore],
    ),
  );

  if (userReceiver.state === `failed`) {
    throw userReceiver.error;
  }

  const gistName = AppTopics.gistName.use();

  return (
    <Page>
      <UserTopbar authStore={authStore} />

      {gistName ? (
        userReceiver.state === `successful` && (
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

import type {AuthorizedAuthStore} from '../hooks/use-auth-store.js';

import {BookmarkList} from './bookmark-list.js';
import {CollectionList} from './collection-list.js';
import {Page} from './page.js';
import {UserTopbar} from './user-topbar.js';
import {UserAPI} from '../apis/user-api.js';
import {useReceiver} from '../hooks/use-receiver.js';
import {useStateMachine} from '../hooks/use-state-machine.js';
import {gistNameStore} from '../stores/gist-name-store.js';
import * as React from 'react';

export interface UserPageProps {
  authStore: AuthorizedAuthStore;
}

export function UserPage({authStore}: UserPageProps): JSX.Element {
  const userReceiver = useReceiver(
    React.useMemo(
      async () => UserAPI.init(authStore.token).then(({user}) => user),
      [authStore],
    ),
  );

  if (userReceiver.state === `failed`) {
    throw userReceiver.error;
  }

  const gistName = useStateMachine(gistNameStore).value;

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

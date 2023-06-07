import type {AuthorizedAuthStore} from '../hooks/use-auth-store.js';

import {Button} from './button.js';
import {ColorSchemeButton} from './color-scheme-button.js';
import {Headline} from './headline.js';
import {Icon} from './icon.js';
import {SearchForm} from './search-form.js';
import {TopbarItem} from './topbar-item.js';
import {Topbar} from './topbar.js';
import {AppTopics} from '../pub-sub/app-topics.js';
import * as React from 'react';

export interface UserTopbarProps {
  readonly authStore: AuthorizedAuthStore;
}

export function UserTopbar({authStore}: UserTopbarProps): JSX.Element {
  const gistName = AppTopics.gistName.use();

  return (
    <Topbar class="Topbar">
      <TopbarItem>
        <Headline />
      </TopbarItem>

      <TopbarItem>
        <ColorSchemeButton />

        <Button
          class="SignOutButton"
          title="Sign out"
          onClick={authStore.signOut}
        >
          <Icon type="logout" />
          Sign out
        </Button>

        {gistName && <SearchForm />}
      </TopbarItem>
    </Topbar>
  );
}

import type {AuthorizedAuthStore} from '../hooks/use-auth-store.js';

import {Button} from './button.js';
import {ColorSchemeButton} from './color-scheme-button.js';
import {Headline} from './headline.js';
import {Icon} from './icon.js';
import {SearchForm} from './search-form.js';
import {TopbarItem} from './topbar-item.js';
import {Topbar} from './topbar.js';
import {useStateMachine} from '../hooks/use-state-machine.js';
import {gistNameStore} from '../stores/gist-name-store.js';
import * as React from 'react';

export interface UserTopbarProps {
  authStore: AuthorizedAuthStore;
}

export function UserTopbar({authStore}: UserTopbarProps): JSX.Element {
  const gistName = useStateMachine(gistNameStore).value;

  return (
    <Topbar className="Topbar">
      <TopbarItem>
        <Headline />
      </TopbarItem>

      <TopbarItem>
        <ColorSchemeButton />

        <Button
          className="SignOutButton"
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

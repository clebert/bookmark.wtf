import type {JSX} from 'preact';
import type {AuthorizedAuthStore} from '../hooks/use-auth-store';
import {AppTopics} from '../pub-sub/app-topics';
import {Button} from './button';
import {ColorSchemeButton} from './color-scheme-button';
import {Headline} from './headline';
import {Icon} from './icon';
import {SearchForm} from './search-form';
import {Topbar} from './topbar';
import {TopbarItem} from './topbar-item';

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
